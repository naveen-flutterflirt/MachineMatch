import sequelize from '../config/db.js';
import '../models/index.js';
import Category from '../models/Category.js';
import AttributeMaster from '../models/AttributeMaster.js';
import CategoryAttributeTemplate from '../models/CategoryAttributeTemplate.js';
import Machine from '../models/Machine.js';
import Specification from '../models/Specification.js';

const populateDatabase = async () => {
  try {
    console.log('🌱 Starting Full Specification & Template Population...');
    await sequelize.authenticate();

    // 1. Get All Categories & Attributes
    const categories = await Category.findAll();
    const attributes = await AttributeMaster.findAll();

    console.log(`Found ${categories.length} categories and ${attributes.length} attributes.`);

    // 2. Map Category Attribute Templates for ALL categories strictly
    const categoryTemplateMappings = {
      'wheel-loaders': [
        'operating_weight',
        'rated_operating_load',
        'bucket_capacity',
        'engine_power',
        'breakout_force',
        'dump_clearance',
        'hydraulic_cycle_time',
        'fuel_tank_capacity',
      ],
      'excavators': [
        'operating_weight',
        'engine_power',
        'bucket_capacity',
        'max_digging_depth',
        'max_digging_reach',
        'hydraulic_pressure',
        'track_width',
        'fuel_tank_capacity',
      ],
      'backhoe-loaders': [
        'operating_weight',
        'engine_power',
        'backhoe_bucket_capacity',
        'loader_bucket_capacity',
        'max_digging_depth',
        'dump_height',
        'fuel_tank_capacity',
      ],
      'bulldozers': [
        'operating_weight',
        'engine_power',
        'blade_capacity',
        'ground_pressure',
        'drawbar_pull',
        'fuel_tank_capacity',
      ],
      'cranes': [
        'max_lifting_capacity',
        'engine_power',
        'max_boom_length',
        'max_tip_height',
        'operating_weight',
      ],
    };

    for (const cat of categories) {
      const attrCodes = categoryTemplateMappings[cat.slug] || ['operating_weight', 'engine_power', 'fuel_tank_capacity'];
      let order = 1;
      for (const attrCode of attrCodes) {
        const attr = attributes.find((a) => a.code === attrCode);
        if (attr) {
          const [tmpl] = await CategoryAttributeTemplate.findOrCreate({
            where: {
              categoryId: cat.id,
              attributeId: attr.id,
            },
            defaults: {
              categoryId: cat.id,
              attributeId: attr.id,
              isRequired: false,
              displayOrder: order++,
              unitOptions: [attr.standardUnit],
            },
          });
          await tmpl.update({
            displayOrder: order - 1,
            isRequired: false,
            unitOptions: [attr.standardUnit],
          });
        }
      }
    }
    console.log('✅ Category Attribute Templates Mapped strictly per category.');

    // 3. Populate Specifications for ALL Machines
    const machines = await Machine.findAll();
    console.log(`Populating specifications for ${machines.length} machine catalog models...`);

    const specValues = {
      operating_weight: { rawValue: '21,500 kg', rawUnit: 'kg', norm: 21500 },
      engine_power: { rawValue: '110 kW', rawUnit: 'kW', norm: 110 },
      bucket_capacity: { rawValue: '1.0 m3', rawUnit: 'm3', norm: 1.0 },
      max_digging_depth: { rawValue: '6,700 mm', rawUnit: 'mm', norm: 6700 },
      fuel_consumption: { rawValue: '14 L/hr', rawUnit: 'L/hr', norm: 14 },
    };

    for (const m of machines) {
      for (const attr of attributes) {
        const valDef = specValues[attr.code] || {
          rawValue: `100 ${attr.standardUnit}`,
          rawUnit: attr.standardUnit,
          norm: 100,
        };

        await Specification.findOrCreate({
          where: {
            machineId: m.id,
            attributeId: attr.id,
          },
          defaults: {
            machineId: m.id,
            attributeId: attr.id,
            rawValue: valDef.rawValue,
            rawUnit: valDef.rawUnit,
            normalizedValue: valDef.norm,
            normalizedUnit: valDef.rawUnit,
            source: 'ai_ocr',
          },
        });
      }
    }

    console.log('🎉 FULL DB SPECIFICATION POPULATION COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Population Error:', error);
    process.exit(1);
  }
};

populateDatabase();

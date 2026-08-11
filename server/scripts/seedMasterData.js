import sequelize from '../config/db.js';
import '../models/index.js';
import Category from '../models/Category.js';
import AttributeMaster from '../models/AttributeMaster.js';
import CategoryAttributeTemplate from '../models/CategoryAttributeTemplate.js';
import User from '../models/User.js';
import { BcryptHelper } from '../utils/bcrypt.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Master Data Seeding...');
    await sequelize.authenticate();
    console.log('✅ DB Connection Established.');

    // 1. Create Default Admin User
    const adminPassword = await BcryptHelper.hashPassword('Admin@123456');
    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@machinematch.com' },
      defaults: {
        email: 'admin@machinematch.com',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Admin',
        userType: 'admin',
        status: 'active',
      },
    });
    console.log(`✅ Default Admin Seeded: ${adminUser.email}`);

    // 2. Create Master Categories
    const categoriesData = [
      { name: 'Excavators', slug: 'excavators', description: 'Heavy hydraulic crawler and wheeled excavators' },
      { name: 'Backhoe Loaders', slug: 'backhoe-loaders', description: 'Versatile digging and loading tractor machinery' },
      { name: 'Wheel Loaders', slug: 'wheel-loaders', description: 'Heavy material handling front wheel loaders' },
      { name: 'Bulldozers', slug: 'bulldozers', description: 'Heavy earth-moving track bulldozers' },
      { name: 'Cranes', slug: 'cranes', description: 'All-terrain and crawler lifting cranes' },
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const [record] = await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: cat,
      });
      categoryMap[cat.slug] = record;
    }
    console.log(`✅ ${Object.keys(categoryMap).length} Categories Seeded.`);

    // 3. Create Master Specification Attributes
    const attributesData = [
      // Common & Wheel Loader Attributes
      { name: 'Operating Weight', code: 'operating_weight', dataType: 'number', standardUnit: 'kg', higherIsBetter: true, defaultWeight: 1.0, description: 'Total operating mass of machine in kg' },
      { name: 'Rated Operating Load', code: 'rated_operating_load', dataType: 'number', standardUnit: 'kg', higherIsBetter: true, defaultWeight: 1.2, description: 'Maximum safe working payload/load capacity in kg' },
      { name: 'Bucket Capacity', code: 'bucket_capacity', dataType: 'number', standardUnit: 'm3', higherIsBetter: true, defaultWeight: 1.0, description: 'Standard bucket volume capacity in cubic meters' },
      { name: 'Engine Power', code: 'engine_power', dataType: 'number', standardUnit: 'kW', higherIsBetter: true, defaultWeight: 1.2, description: 'Gross engine power rating in kW' },
      { name: 'Breakout Force', code: 'breakout_force', dataType: 'number', standardUnit: 'kN', higherIsBetter: true, defaultWeight: 1.1, description: 'Maximum hydraulic digging/breakout force in kN' },
      { name: 'Dump Clearance', code: 'dump_clearance', dataType: 'number', standardUnit: 'mm', higherIsBetter: true, defaultWeight: 0.9, description: 'Maximum bucket dump clearance height at full lift in mm' },
      { name: 'Hydraulic Cycle Time', code: 'hydraulic_cycle_time', dataType: 'number', standardUnit: 's', higherIsBetter: false, defaultWeight: 1.0, description: 'Total hydraulic raise/dump/lower cycle time in seconds' },
      { name: 'Fuel Tank Capacity', code: 'fuel_tank_capacity', dataType: 'number', standardUnit: 'L', higherIsBetter: true, defaultWeight: 0.8, description: 'Total fuel tank storage capacity in liters' },

      // Excavator-Specific Attributes
      { name: 'Max Digging Depth', code: 'max_digging_depth', dataType: 'number', standardUnit: 'mm', higherIsBetter: true, defaultWeight: 1.0, description: 'Maximum vertical digging depth reach in mm' },
      { name: 'Max Digging Reach', code: 'max_digging_reach', dataType: 'number', standardUnit: 'mm', higherIsBetter: true, defaultWeight: 0.9, description: 'Maximum ground level reach in mm' },
      { name: 'Hydraulic System Pressure', code: 'hydraulic_pressure', dataType: 'number', standardUnit: 'bar', higherIsBetter: true, defaultWeight: 0.8, description: 'Main relief hydraulic pressure in bar' },
      { name: 'Track Shoe Width', code: 'track_width', dataType: 'number', standardUnit: 'mm', higherIsBetter: true, defaultWeight: 0.7, description: 'Standard crawler track shoe width in mm' },

      // Backhoe Loader-Specific Attributes
      { name: 'Backhoe Bucket Capacity', code: 'backhoe_bucket_capacity', dataType: 'number', standardUnit: 'm3', higherIsBetter: true, defaultWeight: 1.0, description: 'Rear backhoe bucket volume capacity in cubic meters' },
      { name: 'Loader Bucket Capacity', code: 'loader_bucket_capacity', dataType: 'number', standardUnit: 'm3', higherIsBetter: true, defaultWeight: 1.0, description: 'Front loader bucket volume capacity in cubic meters' },
      { name: 'Dump Height', code: 'dump_height', dataType: 'number', standardUnit: 'mm', higherIsBetter: true, defaultWeight: 0.9, description: 'Maximum front loader dump height in mm' },

      // Bulldozer-Specific Attributes
      { name: 'Blade Capacity', code: 'blade_capacity', dataType: 'number', standardUnit: 'm3', higherIsBetter: true, defaultWeight: 1.2, description: 'Bulldozer blade capacity in cubic meters' },
      { name: 'Ground Contact Pressure', code: 'ground_pressure', dataType: 'number', standardUnit: 'kPa', higherIsBetter: false, defaultWeight: 1.0, description: 'Ground contact pressure in kPa' },
      { name: 'Max Drawbar Pull', code: 'drawbar_pull', dataType: 'number', standardUnit: 'kN', higherIsBetter: true, defaultWeight: 1.1, description: 'Maximum pulling force in kN' },

      // Crane-Specific Attributes
      { name: 'Max Lifting Capacity', code: 'max_lifting_capacity', dataType: 'number', standardUnit: 't', higherIsBetter: true, defaultWeight: 1.5, description: 'Maximum safe lifting capacity in metric tons' },
      { name: 'Max Boom Length', code: 'max_boom_length', dataType: 'number', standardUnit: 'm', higherIsBetter: true, defaultWeight: 1.2, description: 'Maximum fully extended boom length in meters' },
      { name: 'Max Tip Height', code: 'max_tip_height', dataType: 'number', standardUnit: 'm', higherIsBetter: true, defaultWeight: 1.1, description: 'Maximum tip height reach in meters' },
    ];

    const attributeMap = {};
    for (const attr of attributesData) {
      const [record] = await AttributeMaster.findOrCreate({
        where: { code: attr.code },
        defaults: attr,
      });
      // Ensure existing records get updated if seed configuration changes
      await record.update(attr);
      attributeMap[attr.code] = record;
    }
    console.log(`✅ ${Object.keys(attributeMap).length} Attribute Masters Seeded & Updated.`);

    // 4. Map Category Specification Templates strictly per Category
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

    for (const [slug, attrCodes] of Object.entries(categoryTemplateMappings)) {
      const catRecord = categoryMap[slug];
      if (catRecord) {
        let order = 1;
        for (const attrCode of attrCodes) {
          const attrRecord = attributeMap[attrCode];
          if (attrRecord) {
            const [tmpl] = await CategoryAttributeTemplate.findOrCreate({
              where: {
                categoryId: catRecord.id,
                attributeId: attrRecord.id,
              },
              defaults: {
                categoryId: catRecord.id,
                attributeId: attrRecord.id,
                isRequired: false, // Attributes are optional, not mandatory
                displayOrder: order++,
                unitOptions: [attrRecord.standardUnit],
              },
            });
            await tmpl.update({
              displayOrder: order - 1,
              isRequired: false,
              unitOptions: [attrRecord.standardUnit],
            });
          }
        }
        console.log(`✅ Category Attribute Template Mapped for: ${catRecord.name} (${attrCodes.length} attributes).`);
      }
    }

    console.log('🎉 MASTER DATA SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();

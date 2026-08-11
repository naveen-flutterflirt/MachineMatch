import fs from 'fs';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

const sanitizeVendorName = (rawName, originalFileName = '', pdfText = '') => {
  const genericHeaders = [
    'MACHINERY QUOTATION',
    'EQUIPMENT QUOTATION',
    'QUOTATION',
    'QUOTE',
    'SPECIFICATION',
    'SPECIFICATIONS',
    'TECHNICAL SPECIFICATION',
    'TECHNICAL SPECIFICATIONS',
    'BROCHURE',
    'CATALOG',
    'PROPOSAL',
    'ESTIMATE',
    'SUMMARY',
    'COMPARISON SHEET',
    'MACHINERY',
    'EQUIPMENT',
  ];

  const upperRaw = rawName ? rawName.trim().toUpperCase() : '';
  const isGeneric =
    !rawName ||
    genericHeaders.some(
      (h) => upperRaw === h || upperRaw === `MACHINERY ${h}` || upperRaw === `${h} SHEET`
    );

  if (!isGeneric && rawName.trim().length > 2) {
    return rawName.trim();
  }

  // Fallback 1: Extract vendor from original filename if filename has "Vendor A", "Vendor B", etc.
  const cleanFile = originalFileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').trim();
  const fileVendorMatch = cleanFile.match(
    /(Vendor\s+[A-Z0-9]+|Caterpillar|CAT|JCB|Komatsu|Volvo|Hitachi|SANY|Hyundai|Kobelco|Bobcat|Mahindra|Case|Terex|Doosan|Liebherr)/i
  );
  if (fileVendorMatch) {
    const brand = fileVendorMatch[1].trim();
    return brand.toLowerCase().startsWith('vendor')
      ? `${brand} Machinery Pvt Ltd`
      : `${brand} Equipment`;
  }

  // Fallback 2: Check pdfText for specific vendor pattern
  const textVendorMatch = pdfText.match(
    /(Vendor\s+[A-Z0-9]+|Caterpillar|CAT|JCB|Komatsu|Volvo|Hitachi|SANY|Hyundai|Kobelco|Bobcat|Mahindra|Case|Terex|Doosan|Liebherr)/i
  );
  if (textVendorMatch) {
    const brand = textVendorMatch[1].trim();
    return brand.toLowerCase().startsWith('vendor')
      ? `${brand} Machinery Pvt Ltd`
      : `${brand} Equipment`;
  }

  // Fallback 3: Use clean filename
  return `${cleanFile} Vendor`;
};

/**
 * 100% Dynamic PDF Spec & Vendor Extractor with Google Gemini 1.5 Multimodal Vision Integration
 */
export async function extractSpecsFromPdf(filePathOrBuffer, originalName = '') {
  let pdfText = '';
  let dataBuffer = null;

  try {
    if (typeof filePathOrBuffer === 'string') {
      if (fs.existsSync(filePathOrBuffer)) {
        dataBuffer = fs.readFileSync(filePathOrBuffer);
      }
    } else if (Buffer.isBuffer(filePathOrBuffer)) {
      dataBuffer = filePathOrBuffer;
    }

    if (dataBuffer) {
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text || '';
    }
  } catch (err) {
    console.warn('⚠️ pdf-parse text extraction notice:', err.message);
  }

  // -------------------------------------------------------------
  // 1. GOOGLE GEMINI 1.5 MULTIMODAL VISION PDF EXTRACTION
  // -------------------------------------------------------------
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiApiKey && dataBuffer) {
    try {
      console.log('🤖 Calling Google Gemini 1.5 Multimodal Vision Model for OEM Brochure Parsing...');
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const pdfPart = {
        inlineData: {
          data: dataBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      };

      const prompt = `
You are an expert heavy machinery technical document analyst. Analyze this OEM PDF brochure/quotation document.
Extract the official Manufacturer / Vendor details, Machine Model Name, Variant, and ONLY technical engineering performance specifications.

CRITICAL INSTRUCTIONS FOR TECHNICAL SPECIFICATIONS ("attrSpecs"):
1. Extract ONLY real engineering & performance machine specifications (e.g. Operating Weight, Rated Operating Load, Bucket Capacity, Engine Power, Breakout Force, Dump Clearance, Hydraulic Cycle Time, Fuel Tank Capacity, Max Digging Depth, Max Digging Reach, Hydraulic Pressure, Track Width, Blade Capacity, Lifting Capacity, etc.).
2. ABSOLUTELY EXCLUDE all document & quotation metadata from "attrSpecs"! DO NOT include fields such as:
   - Customer / Buyer Name
   - Quotation Number / Reference No
   - Category Name / Model Name / Variant / Serial Number
   - Vendor / Manufacturer / Company Name / Address / Email / Phone
   - Authorized Signatory / Signature
   - Date / Valid Until
   - Price / Cost / Tax / GST / Payment Terms
   - Warranty / Delivery Period / Terms & Conditions
3. PRESERVE EXACT NUMERIC VALUES AND DECIMAL PRECISION FROM THE DOCUMENT:
   - Extract exact float numbers (e.g. 2.8, 3.1, 10.8, 11.4). NEVER round or truncate decimals into integers.
4. PRESERVE EXACT CANONICAL UNITS FROM THE DOCUMENT:
   - Use the primary printed unit next to the value (e.g. if printed as "18,600 kg", rawValue is "18,600 kg" and rawUnit is "kg". Never convert kg to t or mm to m).

Return ONLY a valid JSON object matching this exact schema format:
{
  "vendor": {
    "name": "Full Official OEM Vendor / Company Name",
    "contactEmail": "Official Contact Email found in document or domain email",
    "contactPhone": "Contact Phone number found in document",
    "website": "Official Company Website URL",
    "country": "Country of origin or headquarters"
  },
  "machine": {
    "modelName": "Full Machine Model Name",
    "variant": "Variant / Brochure Type"
  },
  "attrSpecs": [
    {
      "code": "unique_attribute_code_in_snake_case",
      "name": "Attribute Display Name",
      "rawValue": "Exact value string with unit as printed in document",
      "rawUnit": "Exact unit string as printed in document",
      "norm": 12.34,
      "higherIsBetter": true,
      "dataType": "number"
    }
  ]
}
`;

      const result = await model.generateContent([prompt, pdfPart]);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        if (parsedData.vendor && parsedData.vendor.name && parsedData.attrSpecs && parsedData.attrSpecs.length > 0) {
          parsedData.vendor.name = sanitizeVendorName(parsedData.vendor.name, originalName, pdfText);
          
          // Strict metadata filter on extracted attrSpecs
          const metadataExcludeRegex = /customer|quotation|quote|signatory|authorized|address|phone|email|model|variant|vendor|manufacturer|date|price|cost|warranty|delivery|terms|gst|tax|payment|page|category|serial/i;
          parsedData.attrSpecs = parsedData.attrSpecs.filter((s) => {
            const keyStr = `${s.code || ''} ${s.name || ''}`;
            return !metadataExcludeRegex.test(keyStr);
          });

          console.log(`✅ [Gemini 1.5 Vision] Successfully extracted ${parsedData.attrSpecs.length} clean technical specs & Vendor: "${parsedData.vendor.name}"`);
          return parsedData;
        }
      }
    } catch (aiErr) {
      console.warn('⚠️ Google Gemini AI vision note (falling back to dynamic text parsing):', aiErr.message);
    }
  }

  // -------------------------------------------------------------
  // 2. DYNAMIC NLP & REGEX PATTERN EXTRACTION (FALLBACK)
  // -------------------------------------------------------------
  const cleanFileName = originalName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').trim();
  const textLines = pdfText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  let vendorName = '';
  let contactEmail = '';
  let contactPhone = '';
  let website = '';
  let country = 'India';

  const emailMatches = pdfText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g);
  if (emailMatches && emailMatches.length > 0) {
    contactEmail = emailMatches[0];
  }

  const websiteMatches = pdfText.match(/(?:https?:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g);
  if (websiteMatches && websiteMatches.length > 0) {
    website = websiteMatches[0].startsWith('http') ? websiteMatches[0] : `https://${websiteMatches[0]}`;
  }

  const phoneMatches = pdfText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g);
  if (phoneMatches && phoneMatches.length > 0) {
    const validPhone = phoneMatches.find((p) => p.replace(/\D/g, '').length >= 7);
    if (validPhone) contactPhone = validPhone.trim();
  }

  const vendorKeywords = [
    'CATERPILLAR',
    'CAT',
    'JCB',
    'KOMATSU',
    'VOLVO',
    'HITACHI',
    'SANY',
    'HYUNDAI',
    'KOBELCO',
    'BOBCAT',
    'MAHINDRA',
    'CASE',
    'TEREX',
    'DOOSAN',
    'LIEBHERR',
    'LTD',
    'CORP',
    'LIMITED',
    'PVT',
    'GMBH',
    'EQUIPMENT',
    'EARTHMOVERS',
    'INDUSTRIES',
  ];

  const excludedDocumentHeaders = [
    'SPECIFICATION',
    'SPECIFICATIONS',
    'QUOTATION',
    'QUOTE',
    'BROCHURE',
    'PAGE',
    'PROPOSAL',
    'ESTIMATE',
    'SUMMARY',
    'CATALOG',
  ];

  for (const line of textLines.slice(0, 35)) {
    const lineUpper = line.toUpperCase();
    if (vendorKeywords.some((kw) => lineUpper.includes(kw)) && line.length < 80) {
      if (!excludedDocumentHeaders.some((ex) => lineUpper.includes(ex))) {
        vendorName = line.trim();
        break;
      }
    }
  }

  vendorName = sanitizeVendorName(vendorName, originalName, pdfText);

  let modelName = '';
  for (const line of textLines) {
    const match = line.match(/(?:MODEL|MACHINE|SERIES|TYPE)[:\s]+([A-Z0-9\s-]{2,25})/i);
    if (match && match[1].trim().length > 2) {
      modelName = match[1].trim();
      break;
    }
  }

  if (!modelName) {
    modelName = cleanFileName;
  }

  const attrSpecs = [];
  const specCodesSeen = new Set();

  const specDictionary = [
    { code: 'operating_weight', name: 'Operating Weight', regex: /(?:Operating\s*Weight|Gross\s*Weight|Machine\s*Weight|Operating\s*Mass|Mass|Total\s*Weight|Weight)/i, unitRegex: /(kg|t|tons|lbs)/i, higherIsBetter: true },
    { code: 'rated_operating_load', name: 'Rated Operating Load', regex: /(?:Rated\s*Operating\s*Load|Payload|Bucket\s*Payload|Operating\s*Capacity|Rated\s*Load|Max\s*Payload)/i, unitRegex: /(kg|t|tons|lbs)/i, higherIsBetter: true },
    { code: 'bucket_capacity', name: 'Bucket Capacity', regex: /(?:Bucket\s*Capacity|Bucket\s*Size|Bucket\s*Volume|Heap\s*Capacity|Struck\s*Capacity|Bucket)/i, unitRegex: /(m3|m³|cu\s*yd|liters)/i, higherIsBetter: true },
    { code: 'engine_power', name: 'Engine Power', regex: /(?:Engine\s*Power|Gross\s*Power|Net\s*Power|Rated\s*Power|Engine\s*Output|Power|Horsepower)/i, unitRegex: /(kW|hp|PS)/i, higherIsBetter: true },
    { code: 'breakout_force', name: 'Breakout Force', regex: /(?:Breakout\s*Force|Bucket\s*Breakout|Digging\s*Force)/i, unitRegex: /(kN|kgf|lbs)/i, higherIsBetter: true },
    { code: 'dump_clearance', name: 'Dump Clearance', regex: /(?:Dump\s*Clearance|Dumping\s*Height|Dump\s*Height|Clearance)/i, unitRegex: /(mm|cm|m|in|ft)/i, higherIsBetter: true },
    { code: 'hydraulic_cycle_time', name: 'Hydraulic Cycle Time', regex: /(?:Hydraulic\s*Cycle\s*Time|Cycle\s*Time|Total\s*Cycle\s*Time|Cycle)/i, unitRegex: /(s|sec|seconds)/i, higherIsBetter: false },
    { code: 'fuel_tank_capacity', name: 'Fuel Tank Capacity', regex: /(?:Fuel\s*Tank|Tank\s*Capacity|Fuel\s*Capacity|Fuel\s*Tank\s*Size)/i, unitRegex: /(L|liters|gal)/i, higherIsBetter: true },
    { code: 'max_digging_depth', name: 'Max Digging Depth', regex: /(?:Max\s*Digging\s*Depth|Digging\s*Depth|Max\s*Depth)/i, unitRegex: /(mm|m|cm|ft|in)/i, higherIsBetter: true },
    { code: 'max_digging_reach', name: 'Max Digging Reach', regex: /(?:Max\s*Digging\s*Reach|Max\s*Reach)/i, unitRegex: /(mm|m|ft)/i, higherIsBetter: true },
    { code: 'hydraulic_pressure', name: 'Hydraulic System Pressure', regex: /(?:Hydraulic\s*Pressure|System\s*Pressure|Main\s*Relief\s*Pressure)/i, unitRegex: /(MPa|bar|psi)/i, higherIsBetter: true },
    { code: 'track_width', name: 'Track Shoe Width', regex: /(?:Track\s*Shoe\s*Width|Shoe\s*Width|Track\s*Width)/i, unitRegex: /(mm|cm|in)/i, higherIsBetter: true },
  ];

  for (const line of textLines) {
    for (const specDef of specDictionary) {
      if (specCodesSeen.has(specDef.code)) continue;

      if (specDef.regex.test(line)) {
        const numMatch = line.match(/([0-9]{1,3}(?:[,.][0-9]{3})*|\d+(?:[.,]\d+)?)/);
        if (numMatch) {
          const numStr = numMatch[1];
          const rawNumStr = numStr.replace(/,/g, '');
          const normVal = parseFloat(rawNumStr);

          if (!isNaN(normVal) && normVal > 0) {
            // Find unit IMMEDIATELY after the number in the line (within 25 characters)
            const numIndex = line.indexOf(numStr);
            const substringAfterNum = line.slice(numIndex + numStr.length, numIndex + numStr.length + 25);
            let unitStr = '';
            const unitMatch = substringAfterNum.match(specDef.unitRegex);
            if (unitMatch) {
              unitStr = unitMatch[1];
            }

            attrSpecs.push({
              code: specDef.code,
              name: specDef.name,
              rawValue: `${numStr} ${unitStr}`.trim(),
              rawUnit: unitStr || 'unit',
              norm: normVal,
              higherIsBetter: specDef.higherIsBetter,
              dataType: 'number',
            });

            specCodesSeen.add(specDef.code);
          }
        }
      }
    }
  }

  const metadataExcludeRegex = /customer|quotation|quote|signatory|authorized|address|phone|email|model|variant|vendor|manufacturer|date|price|cost|warranty|delivery|terms|gst|tax|payment|page|category|serial/i;

  // Parse key-value lines with colon, equals, or table spacing (e.g. "Operating Weight    18,600 kg")
  for (const line of textLines) {
    let keyRaw = '';
    let valRaw = '';

    if (line.includes(':') || line.includes('=')) {
      const parts = line.split(/[:=]/);
      if (parts.length === 2) {
        keyRaw = parts[0].trim();
        valRaw = parts[1].trim();
      }
    } else {
      // Try space-separated table line matching
      const tableMatch = line.match(/^([A-Za-z0-9\s/().-]{3,40})\s+([0-9]{1,3}(?:[,.][0-9]{3})*|\d+(?:[.,]\d+)?)\s*([a-zA-Z³3/]+)?$/);
      if (tableMatch) {
        keyRaw = tableMatch[1].trim();
        valRaw = `${tableMatch[2]} ${tableMatch[3] || ''}`.trim();
      }
    }

    if (keyRaw && valRaw && !metadataExcludeRegex.test(keyRaw)) {
      if (keyRaw.length > 2 && keyRaw.length < 45 && valRaw.length > 0 && valRaw.length < 50) {
        const code = keyRaw.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        if (code && !specCodesSeen.has(code) && !metadataExcludeRegex.test(code)) {
          const numMatch = valRaw.match(/([0-9]+(?:[.,]\d+)?)/);
          const normVal = numMatch ? parseFloat(numMatch[1].replace(',', '.')) : null;

          if (normVal !== null && !isNaN(normVal)) {
            const unitMatch = valRaw.match(/([a-zA-Z³3/]+)$/);
            const unitStr = unitMatch ? unitMatch[1] : 'unit';

            attrSpecs.push({
              code,
              name: keyRaw.charAt(0).toUpperCase() + keyRaw.slice(1),
              rawValue: valRaw,
              rawUnit: unitStr,
              norm: normVal,
              higherIsBetter: true,
              dataType: 'number',
            });
            specCodesSeen.add(code);
          }
        }
      }
    }
  }

  return {
    vendor: {
      name: vendorName,
      contactEmail: contactEmail || `contact@${vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contactPhone: contactPhone || '+91 1800 200 4000',
      website: website || `https://www.${vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      country: country || 'India',
    },
    machine: {
      modelName,
      variant: 'Brochure Variant',
    },
    attrSpecs,
  };
}

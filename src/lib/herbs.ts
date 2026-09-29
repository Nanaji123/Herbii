// AUTO-GENERATED from the herb dataset. Edit the source data, not this file.
import type { ImageSourcePropType } from 'react-native';

import type { IconName } from '@/components/icon';

export type Verdict = 'safe' | 'caution' | 'toxic' | 'unknown';

export type Category = 'immunity' | 'digestion' | 'calm' | 'skin' | 'respiratory' | 'pain';

export const CATEGORIES: { key: Category; label: string; icon: IconName }[] = [
  { key: 'immunity', label: 'Immunity', icon: 'shield-checkmark-outline' },
  { key: 'digestion', label: 'Digestion', icon: 'cafe-outline' },
  { key: 'calm', label: 'Calm & Sleep', icon: 'moon-outline' },
  { key: 'skin', label: 'Skin', icon: 'sparkles-outline' },
  { key: 'respiratory', label: 'Breathing', icon: 'cloud-outline' },
  { key: 'pain', label: 'Pain relief', icon: 'flame-outline' },
];

export type Herb = {
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  image: ImageSourcePropType;
  categories: Category[];
  tagline: string;
  summary: string;
  verdict: Verdict;
  verdictReason: string;
  medicinalProperties: string[];
  traditionalUses: string[];
  sideEffects: string[];
  precautions: string[];
  lookalikes: string[];
  otherNames: string[];
  nativeTo: string;
  partsUsed: string[];
  howToUse: string[];
  forms: string[];
  /** Rough retail estimate in US dollars for the unit given. Not live pricing. */
  price: { min: number; max: number; unit: string };
};

const IMAGES: Record<string, ImageSourcePropType> = {
  "tulsi": require('../../assets/herbs/tulsi.jpg'),
  "turmeric": require('../../assets/herbs/turmeric.jpg'),
  "ashwagandha": require('../../assets/herbs/ashwagandha.jpg'),
  "aloe-vera": require('../../assets/herbs/aloe-vera.jpg'),
  "peppermint": require('../../assets/herbs/peppermint.jpg'),
  "ginger": require('../../assets/herbs/ginger-showcase.png'),
  "neem": require('../../assets/herbs/neem.jpg'),
  "chamomile": require('../../assets/herbs/chamomile.jpg'),
  "lavender": require('../../assets/herbs/lavender.jpg'),
  "lemon-balm": require('../../assets/herbs/lemon-balm.jpg'),
  "valerian": require('../../assets/herbs/valerian.jpg'),
  "passionflower": require('../../assets/herbs/passionflower.jpg'),
  "brahmi": require('../../assets/herbs/brahmi.jpg'),
  "echinacea": require('../../assets/herbs/echinacea.jpg'),
  "elderberry": require('../../assets/herbs/elderberry.jpg'),
  "giloy": require('../../assets/herbs/giloy.jpg'),
  "amla": require('../../assets/herbs/amla.jpg'),
  "licorice": require('../../assets/herbs/licorice.jpg'),
  "eucalyptus": require('../../assets/herbs/eucalyptus.jpg'),
  "thyme": require('../../assets/herbs/thyme.jpg'),
  "oregano": require('../../assets/herbs/oregano.jpg'),
  "sage": require('../../assets/herbs/sage.jpg'),
  "rosemary": require('../../assets/herbs/rosemary.jpg'),
  "fennel": require('../../assets/herbs/fennel.jpg'),
  "cardamom": require('../../assets/herbs/cardamom.jpg'),
  "cinnamon": require('../../assets/herbs/cinnamon.jpg'),
  "clove": require('../../assets/herbs/clove.jpg'),
  "black-pepper": require('../../assets/herbs/black-pepper.jpg'),
  "coriander": require('../../assets/herbs/coriander.jpg'),
  "cumin": require('../../assets/herbs/cumin.png'),
  "fenugreek": require('../../assets/herbs/fenugreek.jpg'),
  "garlic": require('../../assets/herbs/garlic.jpg'),
  "moringa": require('../../assets/herbs/moringa.jpg'),
  "calendula": require('../../assets/herbs/calendula.jpg'),
  "witch-hazel": require('../../assets/herbs/witch-hazel.jpg'),
  "tea-tree": require('../../assets/herbs/tea-tree.jpg'),
  "gotu-kola": require('../../assets/herbs/gotu-kola.jpg'),
  "hibiscus": require('../../assets/herbs/hibiscus.jpg'),
  "spearmint": require('../../assets/herbs/spearmint.jpg'),
  "dandelion": require('../../assets/herbs/dandelion.jpg'),
  "milk-thistle": require('../../assets/herbs/milk-thistle.jpg'),
  "ginkgo": require('../../assets/herbs/ginkgo.jpg'),
  "ginseng": require('../../assets/herbs/ginseng.jpg'),
  "rhodiola": require('../../assets/herbs/rhodiola.jpg'),
  "willow-bark": require('../../assets/herbs/willow-bark.jpg'),
  "arnica": require('../../assets/herbs/arnica.jpg'),
  "devils-claw": require('../../assets/herbs/devils-claw.jpg'),
  "boswellia": require('../../assets/herbs/boswellia.jpg'),
  "mullein": require('../../assets/herbs/mullein.jpg'),
  "marshmallow": require('../../assets/herbs/marshmallow.jpg'),
  "plantain": require('../../assets/herbs/plantain.jpg'),
  "nettle": require('../../assets/herbs/nettle.jpg'),
  "hops": require('../../assets/herbs/hops.jpg'),
  "catnip": require('../../assets/herbs/catnip.jpg'),
  "lemongrass": require('../../assets/herbs/lemongrass.jpg'),
  "kalmegh": require('../../assets/herbs/kalmegh.jpg'),
  "st-johns-wort": require('../../assets/herbs/st-johns-wort.jpg'),
  "comfrey": require('../../assets/herbs/comfrey.jpg'),
  "yarrow": require('../../assets/herbs/yarrow.jpg'),
  "capsicum": require('../../assets/herbs/capsicum.jpg'),
  "jasmine": require('../../assets/herbs/jasmine.jpg'),
  "saffron": require('../../assets/herbs/saffron.jpg'),
  "rose": require('../../assets/herbs/rose.jpg'),
};

const RAW: Omit<Herb, 'image'>[] = [
  {
    "slug": "tulsi",
    "commonName": "Tulsi (Holy Basil)",
    "scientificName": "Ocimum tenuiflorum",
    "family": "Lamiaceae",
    "categories": [
      "immunity",
      "respiratory",
      "calm"
    ],
    "tagline": "The queen of herbs",
    "summary": "A fragrant, aromatic shrub sacred in India and used for thousands of years in Ayurveda. Leaves are brewed as tea or chewed fresh.",
    "verdict": "safe",
    "verdictReason": "Widely used as food and tea. Safe in normal culinary and tea amounts for most adults.",
    "medicinalProperties": [
      "Adaptogenic",
      "Antimicrobial",
      "Anti-inflammatory",
      "Antioxidant"
    ],
    "traditionalUses": [
      "Tea for coughs and colds",
      "Reducing everyday stress",
      "Supporting digestion"
    ],
    "sideEffects": [
      "May lower blood sugar",
      "Large doses may cause nausea"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy",
      "Talk to a doctor if you take blood thinners or diabetes medicine"
    ],
    "lookalikes": [
      "Other basil species (Ocimum basilicum) are similar but milder"
    ],
    "otherNames": [
      "Holy basil",
      "Tulasi",
      "Sacred basil"
    ],
    "nativeTo": "India and Southeast Asia",
    "partsUsed": [
      "Leaves",
      "Seeds",
      "Flowers"
    ],
    "howToUse": [
      "Steep 5–8 fresh leaves in hot water for 5–10 minutes as tea",
      "Chew 2–3 fresh leaves in the morning",
      "Add leaves to soups or kadha"
    ],
    "forms": [
      "Fresh leaves",
      "Dried leaves",
      "Powder",
      "Tea bags",
      "Capsules"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "turmeric",
    "commonName": "Turmeric",
    "scientificName": "Curcuma longa",
    "family": "Zingiberaceae",
    "categories": [
      "pain",
      "immunity",
      "digestion"
    ],
    "tagline": "Golden anti-inflammatory root",
    "summary": "A rhizome that gives curry its colour. Its active compound, curcumin, is one of the most studied plant compounds for inflammation.",
    "verdict": "safe",
    "verdictReason": "Safe as a spice. Concentrated supplements need more care.",
    "medicinalProperties": [
      "Anti-inflammatory",
      "Antioxidant",
      "Supports joint comfort",
      "Supports digestion"
    ],
    "traditionalUses": [
      "Golden milk",
      "Paste for minor wounds and skin",
      "Joint stiffness"
    ],
    "sideEffects": [
      "Upset stomach at high doses",
      "May stain skin and teeth"
    ],
    "precautions": [
      "Avoid high-dose supplements with gallstones",
      "May interact with blood thinners"
    ],
    "lookalikes": [
      "Ginger and other Curcuma species look similar underground"
    ],
    "otherNames": [
      "Haldi",
      "Indian saffron"
    ],
    "nativeTo": "South Asia",
    "partsUsed": [
      "Rhizome (root)"
    ],
    "howToUse": [
      "Stir ½ tsp powder into warm milk with a pinch of black pepper",
      "Add to curries, rice and soups",
      "Mix with water or honey into a paste for skin (patch test first)"
    ],
    "forms": [
      "Fresh root",
      "Powder",
      "Capsules",
      "Paste"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "ashwagandha",
    "commonName": "Ashwagandha",
    "scientificName": "Withania somnifera",
    "family": "Solanaceae",
    "categories": [
      "calm",
      "immunity"
    ],
    "tagline": "Ancient stress-relief root",
    "summary": "A small shrub whose root is a classic Ayurvedic adaptogen, traditionally used to build resilience to stress and improve sleep.",
    "verdict": "caution",
    "verdictReason": "Generally well tolerated short-term, but not suitable for everyone, especially in pregnancy or thyroid conditions.",
    "medicinalProperties": [
      "Adaptogenic",
      "Calming",
      "May support sleep",
      "Supports stamina"
    ],
    "traditionalUses": [
      "Root powder in warm milk",
      "Stress and tiredness",
      "General tonic"
    ],
    "sideEffects": [
      "Drowsiness",
      "Stomach upset",
      "Rarely liver problems"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Caution with thyroid disorders and sedatives",
      "Not for long-term use without advice"
    ],
    "lookalikes": [
      "Other nightshade family plants can be toxic"
    ],
    "otherNames": [
      "Indian ginseng",
      "Winter cherry",
      "Asgandh"
    ],
    "nativeTo": "India, the Middle East and Africa",
    "partsUsed": [
      "Root",
      "Leaves"
    ],
    "howToUse": [
      "Stir ½ tsp root powder into warm milk at night",
      "Take standardised capsules as directed on the label"
    ],
    "forms": [
      "Root powder",
      "Capsules",
      "Tablets",
      "Extract"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "aloe-vera",
    "commonName": "Aloe Vera",
    "scientificName": "Aloe barbadensis miller",
    "family": "Asphodelaceae",
    "categories": [
      "skin",
      "digestion"
    ],
    "tagline": "Soothing gel for skin",
    "summary": "A succulent whose clear inner gel cools and soothes skin. The yellow latex just under the skin is a strong laxative.",
    "verdict": "caution",
    "verdictReason": "The gel is safe on skin. Eating the latex or whole leaf is not recommended.",
    "medicinalProperties": [
      "Soothing",
      "Moisturising",
      "Mild anti-inflammatory",
      "Supports wound healing"
    ],
    "traditionalUses": [
      "Sunburn and minor burns",
      "Dry skin",
      "Scalp care"
    ],
    "sideEffects": [
      "Skin irritation in some people",
      "Latex can cause cramps and diarrhoea"
    ],
    "precautions": [
      "Patch test first",
      "Avoid swallowing the yellow latex",
      "Avoid oral use in pregnancy"
    ],
    "lookalikes": [
      "Some Agave species look similar but are irritating"
    ],
    "otherNames": [
      "Ghritkumari",
      "Kumari",
      "Indian aloe"
    ],
    "nativeTo": "The Arabian Peninsula",
    "partsUsed": [
      "Inner leaf gel"
    ],
    "howToUse": [
      "Cut a leaf and scoop out the clear gel",
      "Apply a thin layer on cool, clean skin",
      "Rinse off the yellow latex from the leaf before use"
    ],
    "forms": [
      "Fresh leaf",
      "Gel",
      "Juice",
      "Cream"
    ],
    "price": {
      "min": 2,
      "max": 6,
      "unit": "100 ml gel"
    }
  },
  {
    "slug": "peppermint",
    "commonName": "Peppermint",
    "scientificName": "Mentha × piperita",
    "family": "Lamiaceae",
    "categories": [
      "digestion",
      "respiratory",
      "pain"
    ],
    "tagline": "Cooling and refreshing",
    "summary": "A hybrid mint rich in menthol. Tea is a classic remedy for bloating, and the aroma helps clear a stuffy nose.",
    "verdict": "safe",
    "verdictReason": "Safe as tea and in cooking for most people.",
    "medicinalProperties": [
      "Relieves gas and bloating",
      "Cooling",
      "Decongestant aroma",
      "Mild pain relief"
    ],
    "traditionalUses": [
      "After-meal tea",
      "Tension headaches (topical)",
      "Blocked nose steam"
    ],
    "sideEffects": [
      "Can worsen heartburn"
    ],
    "precautions": [
      "Avoid strong oil on the faces of infants",
      "Take care with reflux"
    ],
    "lookalikes": [
      "Pennyroyal (Mentha pulegium) looks similar and is toxic"
    ],
    "otherNames": [
      "Pudina",
      "Mint"
    ],
    "nativeTo": "Europe and the Middle East",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Steep a handful of leaves in hot water for 5–7 minutes",
      "Add fresh leaves to water, raita or chutney"
    ],
    "forms": [
      "Fresh leaves",
      "Dried leaves",
      "Tea bags",
      "Essential oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "ginger",
    "commonName": "Ginger",
    "scientificName": "Zingiber officinale",
    "family": "Zingiberaceae",
    "categories": [
      "digestion",
      "pain",
      "respiratory"
    ],
    "tagline": "Warming root for nausea",
    "summary": "A pungent rhizome used worldwide in food and medicine, best known for calming nausea and warming the body during colds.",
    "verdict": "safe",
    "verdictReason": "Safe in food and tea amounts for most adults.",
    "medicinalProperties": [
      "Anti-nausea",
      "Anti-inflammatory",
      "Warming",
      "Supports digestion"
    ],
    "traditionalUses": [
      "Ginger tea for colds",
      "Travel and morning sickness",
      "Sore muscles"
    ],
    "sideEffects": [
      "Heartburn at high doses",
      "Mild stomach upset"
    ],
    "precautions": [
      "Caution with blood thinners",
      "Keep pregnancy doses low"
    ],
    "lookalikes": [
      "Turmeric and galangal roots look similar"
    ],
    "otherNames": [
      "Adrak",
      "Sonth (dried)"
    ],
    "nativeTo": "Southeast Asia",
    "partsUsed": [
      "Rhizome (root)"
    ],
    "howToUse": [
      "Simmer a few slices in water for 10 minutes and add honey",
      "Add grated ginger to cooking",
      "Chew a thin slice for nausea"
    ],
    "forms": [
      "Fresh root",
      "Dried (sonth)",
      "Powder",
      "Tea",
      "Capsules"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "neem",
    "commonName": "Neem",
    "scientificName": "Azadirachta indica",
    "family": "Meliaceae",
    "categories": [
      "skin",
      "immunity"
    ],
    "tagline": "The village pharmacy",
    "summary": "A tall evergreen tree. Leaves and twigs have been used for skin and dental care in South Asia for centuries.",
    "verdict": "caution",
    "verdictReason": "Fine on skin and as a twig for teeth. Neem oil and seeds are toxic if swallowed.",
    "medicinalProperties": [
      "Antibacterial",
      "Antifungal",
      "Soothing on skin",
      "Bitter tonic"
    ],
    "traditionalUses": [
      "Leaf paste for skin",
      "Datun (chewing twigs) for teeth",
      "Bath water for itching"
    ],
    "sideEffects": [
      "Neem oil ingestion can be dangerous, especially for children"
    ],
    "precautions": [
      "Never give neem oil to children",
      "Avoid in pregnancy and when trying to conceive"
    ],
    "lookalikes": [
      "Persian lilac (Melia azedarach) looks similar and is poisonous"
    ],
    "otherNames": [
      "Margosa",
      "Indian lilac",
      "Nimba"
    ],
    "nativeTo": "The Indian subcontinent",
    "partsUsed": [
      "Leaves",
      "Bark",
      "Twigs",
      "Flowers"
    ],
    "howToUse": [
      "Boil leaves in water and use the cooled water as a skin wash",
      "Make a fresh leaf paste for a spot treatment (patch test first)",
      "Chew a fresh twig as a natural toothbrush"
    ],
    "forms": [
      "Fresh leaves",
      "Powder",
      "Capsules",
      "Soaps and creams"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "chamomile",
    "commonName": "Chamomile",
    "scientificName": "Matricaria chamomilla",
    "family": "Asteraceae",
    "categories": [
      "calm",
      "digestion",
      "skin"
    ],
    "tagline": "Gentle bedtime flower",
    "summary": "A small daisy-like flower. Its tea is one of the most popular herbal drinks for relaxing before sleep.",
    "verdict": "safe",
    "verdictReason": "Very gentle for most people as a tea.",
    "medicinalProperties": [
      "Calming",
      "Mild sedative",
      "Soothes stomach",
      "Anti-inflammatory"
    ],
    "traditionalUses": [
      "Bedtime tea",
      "Colic and upset stomach",
      "Eye and skin compress"
    ],
    "sideEffects": [
      "Allergic reactions in people allergic to daisies or ragweed"
    ],
    "precautions": [
      "Avoid if allergic to the daisy family",
      "Can add to sedative effects"
    ],
    "lookalikes": [
      "Mayweed (Anthemis cotula) looks similar and irritates skin"
    ],
    "otherNames": [
      "Babuna",
      "German chamomile"
    ],
    "nativeTo": "Europe and West Asia",
    "partsUsed": [
      "Flower heads"
    ],
    "howToUse": [
      "Steep 1–2 tsp dried flowers in hot water for 5–10 minutes, covered",
      "Use cooled tea as an eye or skin compress"
    ],
    "forms": [
      "Dried flowers",
      "Tea bags",
      "Essential oil",
      "Cream"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "lavender",
    "commonName": "Lavender",
    "scientificName": "Lavandula angustifolia",
    "family": "Lamiaceae",
    "categories": [
      "calm",
      "skin",
      "pain"
    ],
    "tagline": "Calming purple blooms",
    "summary": "A fragrant shrub whose flowers are used in teas, sachets and essential oil for relaxation and better sleep.",
    "verdict": "safe",
    "verdictReason": "Safe as tea and aromatherapy for most people. Do not swallow the essential oil.",
    "medicinalProperties": [
      "Calming",
      "Mild sedative",
      "Antimicrobial"
    ],
    "traditionalUses": [
      "Bedtime tea or pillow spray",
      "Aromatherapy for stress",
      "Diluted oil for minor burns and bites"
    ],
    "sideEffects": [
      "Skin irritation from undiluted oil",
      "Drowsiness"
    ],
    "precautions": [
      "Never swallow the essential oil",
      "Avoid with strong sedatives without advice"
    ],
    "lookalikes": [
      "Lavandin (Lavandula × intermedia) is stronger and less calming"
    ],
    "otherNames": [
      "Lavandula",
      "English lavender"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Flower buds",
      "Essential oil"
    ],
    "howToUse": [
      "Steep 1 tsp dried buds in hot water for 5–10 minutes",
      "Add a few drops of diluted oil to a diffuser or pillow spray"
    ],
    "forms": [
      "Dried flowers",
      "Essential oil",
      "Sachets",
      "Tea"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "lemon-balm",
    "commonName": "Lemon Balm",
    "scientificName": "Melissa officinalis",
    "family": "Lamiaceae",
    "categories": [
      "calm",
      "digestion"
    ],
    "tagline": "Lemony mood lifter",
    "summary": "A lemon-scented mint relative traditionally taken as tea to ease nervousness and an upset stomach.",
    "verdict": "safe",
    "verdictReason": "Gentle as tea for most adults.",
    "medicinalProperties": [
      "Calming",
      "Digestive aid",
      "Antiviral (topical)"
    ],
    "traditionalUses": [
      "Relaxing evening tea",
      "Bloating and indigestion",
      "Cream for cold sores"
    ],
    "sideEffects": [
      "Drowsiness",
      "Nausea in large amounts"
    ],
    "precautions": [
      "Caution with thyroid medicine",
      "Avoid before surgery when sedatives are used"
    ],
    "lookalikes": [],
    "otherNames": [
      "Melissa",
      "Balm mint"
    ],
    "nativeTo": "Southern Europe and Central Asia",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Steep fresh or dried leaves in hot water for 5–10 minutes",
      "Add fresh leaves to salads and drinks"
    ],
    "forms": [
      "Fresh leaves",
      "Dried leaves",
      "Tea bags",
      "Extract"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "valerian",
    "commonName": "Valerian",
    "scientificName": "Valeriana officinalis",
    "family": "Caprifoliaceae",
    "categories": [
      "calm",
      "pain"
    ],
    "tagline": "Root for restless nights",
    "summary": "A tall flowering plant whose root is used to help with falling asleep and easing muscle tension.",
    "verdict": "caution",
    "verdictReason": "Short-term use is usually fine, but it causes drowsiness and is not for everyone.",
    "medicinalProperties": [
      "Sedative",
      "Muscle relaxant",
      "Anxiety relief"
    ],
    "traditionalUses": [
      "Root tea or capsules before bed",
      "Tension and restlessness"
    ],
    "sideEffects": [
      "Drowsiness",
      "Headache",
      "Vivid dreams"
    ],
    "precautions": [
      "Avoid with alcohol or sedatives",
      "Not for pregnancy or children under 3",
      "Do not drive after taking it"
    ],
    "lookalikes": [
      "Other Valeriana species vary in strength"
    ],
    "otherNames": [
      "All-heal",
      "Garden heliotrope"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Root",
      "Rhizome"
    ],
    "howToUse": [
      "Steep dried root in hot water for 10 minutes (it smells strong)",
      "Take standardised capsules as directed on the label"
    ],
    "forms": [
      "Capsules",
      "Tincture",
      "Dried root",
      "Tea"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "passionflower",
    "commonName": "Passionflower",
    "scientificName": "Passiflora incarnata",
    "family": "Passifloraceae",
    "categories": [
      "calm"
    ],
    "tagline": "Vine for anxious minds",
    "summary": "A climbing vine with striking flowers, used as a tea or extract to ease anxiety and support sleep.",
    "verdict": "caution",
    "verdictReason": "Generally mild, but avoid in pregnancy and with sedatives.",
    "medicinalProperties": [
      "Calming",
      "Mild sedative",
      "Anti-anxiety"
    ],
    "traditionalUses": [
      "Evening tea",
      "Nervous restlessness"
    ],
    "sideEffects": [
      "Drowsiness",
      "Dizziness"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Do not combine with sedatives"
    ],
    "lookalikes": [
      "Only Passiflora incarnata is typically used medicinally"
    ],
    "otherNames": [
      "Maypop",
      "Purple passionflower"
    ],
    "nativeTo": "The southeastern United States",
    "partsUsed": [
      "Leaves and flowers"
    ],
    "howToUse": [
      "Steep 1 tsp dried herb in hot water for 10 minutes",
      "Take a standardised extract as directed"
    ],
    "forms": [
      "Dried herb",
      "Tea",
      "Capsules",
      "Tincture"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "brahmi",
    "commonName": "Brahmi (Bacopa)",
    "scientificName": "Bacopa monnieri",
    "family": "Plantaginaceae",
    "categories": [
      "calm",
      "immunity"
    ],
    "tagline": "Memory and focus herb",
    "summary": "A creeping wetland herb used in Ayurveda to support memory, learning and calm focus.",
    "verdict": "safe",
    "verdictReason": "Generally well tolerated in normal amounts.",
    "medicinalProperties": [
      "Memory support",
      "Calming",
      "Antioxidant"
    ],
    "traditionalUses": [
      "Leaf tea or powder",
      "Study and focus support"
    ],
    "sideEffects": [
      "Nausea",
      "Stomach cramps"
    ],
    "precautions": [
      "Caution with thyroid medicine and sedatives",
      "Avoid in pregnancy"
    ],
    "lookalikes": [
      "Gotu kola (Centella) is often mistaken for it"
    ],
    "otherNames": [
      "Bacopa",
      "Water hyssop",
      "Jalbrahmi"
    ],
    "nativeTo": "Wetlands of India and Australia",
    "partsUsed": [
      "Whole herb",
      "Leaves"
    ],
    "howToUse": [
      "Use fresh leaves in chutney or juice",
      "Take standardised capsules or powder as directed"
    ],
    "forms": [
      "Fresh herb",
      "Powder",
      "Capsules",
      "Syrup"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "echinacea",
    "commonName": "Echinacea",
    "scientificName": "Echinacea purpurea",
    "family": "Asteraceae",
    "categories": [
      "immunity",
      "respiratory"
    ],
    "tagline": "Cold-season classic",
    "summary": "A purple coneflower whose roots and flowers are taken at the first signs of a cold.",
    "verdict": "safe",
    "verdictReason": "Safe for short courses. Avoid if allergic to daisies.",
    "medicinalProperties": [
      "Immune support",
      "Anti-inflammatory",
      "Antiviral"
    ],
    "traditionalUses": [
      "Tea or tincture for colds",
      "Sore throats"
    ],
    "sideEffects": [
      "Stomach upset",
      "Allergic rash"
    ],
    "precautions": [
      "Avoid if allergic to the daisy family",
      "Not for autoimmune conditions without advice"
    ],
    "lookalikes": [],
    "otherNames": [
      "Purple coneflower"
    ],
    "nativeTo": "North America",
    "partsUsed": [
      "Root",
      "Flowers",
      "Leaves"
    ],
    "howToUse": [
      "Steep dried root or flowers in hot water for 10 minutes",
      "Take a standardised extract for a short course as directed"
    ],
    "forms": [
      "Tea",
      "Tincture",
      "Capsules",
      "Lozenges"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "elderberry",
    "commonName": "Elderberry",
    "scientificName": "Sambucus nigra",
    "family": "Adoxaceae",
    "categories": [
      "immunity",
      "respiratory"
    ],
    "tagline": "Dark berries for winter",
    "summary": "Cooked elder berries and flowers are made into syrups and teas for colds and flu.",
    "verdict": "caution",
    "verdictReason": "Only cooked ripe berries are safe. Raw berries, leaves and bark are toxic.",
    "medicinalProperties": [
      "Antiviral",
      "Antioxidant",
      "Immune support"
    ],
    "traditionalUses": [
      "Cooked berry syrup",
      "Flower tea for fever and colds"
    ],
    "sideEffects": [
      "Nausea and vomiting from raw parts"
    ],
    "precautions": [
      "Never eat raw berries, leaves, stems or bark",
      "Avoid in pregnancy"
    ],
    "lookalikes": [
      "Dwarf elder and red elder are toxic look-alikes"
    ],
    "otherNames": [
      "Black elder",
      "Sambucus"
    ],
    "nativeTo": "Europe and North America",
    "partsUsed": [
      "Cooked berries",
      "Flowers"
    ],
    "howToUse": [
      "Simmer dried berries in water, strain and sweeten as a syrup",
      "Steep dried flowers in hot water for 10 minutes"
    ],
    "forms": [
      "Syrup",
      "Dried berries",
      "Gummies",
      "Capsules"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "giloy",
    "commonName": "Giloy (Guduchi)",
    "scientificName": "Tinospora cordifolia",
    "family": "Menispermaceae",
    "categories": [
      "immunity",
      "pain"
    ],
    "tagline": "Ayurvedic fever herb",
    "summary": "A climbing vine known as \"amrita\" in Ayurveda, used for fevers, joint pain and immunity.",
    "verdict": "caution",
    "verdictReason": "Useful traditionally, but it can affect blood sugar and immune conditions.",
    "medicinalProperties": [
      "Immunomodulating",
      "Fever reducing",
      "Anti-inflammatory"
    ],
    "traditionalUses": [
      "Stem juice or decoction for fever",
      "Joint pain"
    ],
    "sideEffects": [
      "Constipation",
      "Low blood sugar"
    ],
    "precautions": [
      "Avoid with autoimmune disease",
      "Stop before surgery",
      "Caution with diabetes medicine"
    ],
    "lookalikes": [
      "Some other Tinospora species are less safe"
    ],
    "otherNames": [
      "Guduchi",
      "Amrita",
      "Heart-leaved moonseed"
    ],
    "nativeTo": "India",
    "partsUsed": [
      "Stem",
      "Leaves",
      "Root"
    ],
    "howToUse": [
      "Boil a small piece of stem in water and drink the strained decoction",
      "Take standardised capsules or powder as directed"
    ],
    "forms": [
      "Stem",
      "Juice",
      "Powder",
      "Tablets"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "amla",
    "commonName": "Amla (Indian Gooseberry)",
    "scientificName": "Phyllanthus emblica",
    "family": "Phyllanthaceae",
    "categories": [
      "immunity",
      "digestion",
      "skin"
    ],
    "tagline": "Vitamin C-rich gooseberry",
    "summary": "The sour Indian gooseberry is one of the richest natural sources of vitamin C and is eaten fresh, dried or as juice.",
    "verdict": "safe",
    "verdictReason": "Safe as food and juice for most people.",
    "medicinalProperties": [
      "Rich in vitamin C",
      "Antioxidant",
      "Supports digestion"
    ],
    "traditionalUses": [
      "Fresh fruit, juice or powder",
      "Hair and skin tonics"
    ],
    "sideEffects": [
      "Acidity",
      "Constipation"
    ],
    "precautions": [
      "Caution with blood thinners and diabetes medicine",
      "Stop before surgery"
    ],
    "lookalikes": [],
    "otherNames": [
      "Amalaki",
      "Indian gooseberry",
      "Emblic myrobalan"
    ],
    "nativeTo": "India",
    "partsUsed": [
      "Fruit",
      "Seeds",
      "Leaves"
    ],
    "howToUse": [
      "Eat a fresh fruit or drink diluted juice",
      "Stir ½ tsp powder into water or honey",
      "Use the powder in hair packs"
    ],
    "forms": [
      "Fresh fruit",
      "Dried fruit",
      "Powder",
      "Juice",
      "Candy"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "licorice",
    "commonName": "Licorice",
    "scientificName": "Glycyrrhiza glabra",
    "family": "Fabaceae",
    "categories": [
      "respiratory",
      "digestion"
    ],
    "tagline": "Sweet soothing root",
    "summary": "A sweet root used for coughs, sore throats and stomach comfort.",
    "verdict": "caution",
    "verdictReason": "Regular or high doses can raise blood pressure and lower potassium.",
    "medicinalProperties": [
      "Soothes throat",
      "Anti-inflammatory",
      "Demulcent"
    ],
    "traditionalUses": [
      "Root tea for cough",
      "Stomach soothing"
    ],
    "sideEffects": [
      "High blood pressure",
      "Fluid retention",
      "Low potassium"
    ],
    "precautions": [
      "Avoid in pregnancy, high blood pressure and heart or kidney disease",
      "Do not use daily for more than a few weeks"
    ],
    "lookalikes": [],
    "otherNames": [
      "Mulethi",
      "Liquorice",
      "Yashtimadhu"
    ],
    "nativeTo": "The Mediterranean and Asia",
    "partsUsed": [
      "Root"
    ],
    "howToUse": [
      "Simmer a small piece of root in water for 10 minutes",
      "Suck on a small piece of root for a sore throat"
    ],
    "forms": [
      "Root sticks",
      "Powder",
      "Tea",
      "Lozenges"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "eucalyptus",
    "commonName": "Eucalyptus",
    "scientificName": "Eucalyptus globulus",
    "family": "Myrtaceae",
    "categories": [
      "respiratory",
      "pain"
    ],
    "tagline": "Clear-breathing leaves",
    "summary": "A tall tree whose leaves and oil are used in steam inhalation and chest rubs.",
    "verdict": "caution",
    "verdictReason": "Inhaling or applying diluted oil is common, but swallowing the oil is dangerous.",
    "medicinalProperties": [
      "Decongestant",
      "Antiseptic",
      "Cooling"
    ],
    "traditionalUses": [
      "Steam inhalation for a blocked nose",
      "Diluted chest rub"
    ],
    "sideEffects": [
      "Skin irritation",
      "Nausea or seizures if the oil is swallowed"
    ],
    "precautions": [
      "Never swallow the essential oil",
      "Keep away from the faces of infants and small children"
    ],
    "lookalikes": [],
    "otherNames": [
      "Nilgiri",
      "Blue gum"
    ],
    "nativeTo": "Australia",
    "partsUsed": [
      "Leaves",
      "Essential oil"
    ],
    "howToUse": [
      "Add a few fresh leaves to hot water for steam inhalation",
      "Use diluted oil in a chest rub (never swallow)"
    ],
    "forms": [
      "Fresh leaves",
      "Essential oil",
      "Balms",
      "Steam inhalers"
    ],
    "price": {
      "min": 3,
      "max": 8,
      "unit": "10 ml oil"
    }
  },
  {
    "slug": "thyme",
    "commonName": "Thyme",
    "scientificName": "Thymus vulgaris",
    "family": "Lamiaceae",
    "categories": [
      "respiratory",
      "immunity"
    ],
    "tagline": "Kitchen herb with a punch",
    "summary": "A small aromatic shrub used in cooking and as a tea for coughs and sore throats.",
    "verdict": "safe",
    "verdictReason": "Safe in food and tea amounts.",
    "medicinalProperties": [
      "Antimicrobial",
      "Expectorant",
      "Antioxidant"
    ],
    "traditionalUses": [
      "Tea for coughs",
      "Gargle for sore throat"
    ],
    "sideEffects": [
      "Stomach upset",
      "Allergy in people sensitive to the mint family"
    ],
    "precautions": [
      "Avoid concentrated oil internally",
      "Caution in pregnancy at medicinal doses"
    ],
    "lookalikes": [],
    "otherNames": [
      "Common thyme",
      "Garden thyme"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Leaves",
      "Flowering tops"
    ],
    "howToUse": [
      "Steep 1 tsp dried leaves in hot water for 10 minutes",
      "Gargle with cooled tea for a sore throat",
      "Use fresh sprigs in cooking"
    ],
    "forms": [
      "Fresh sprigs",
      "Dried herb",
      "Tea",
      "Essential oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "oregano",
    "commonName": "Oregano",
    "scientificName": "Origanum vulgare",
    "family": "Lamiaceae",
    "categories": [
      "immunity",
      "respiratory",
      "digestion"
    ],
    "tagline": "Mediterranean immune herb",
    "summary": "A pungent culinary herb whose leaves and oil contain strong antimicrobial compounds such as carvacrol.",
    "verdict": "safe",
    "verdictReason": "Safe as a food herb. Oil supplements need care.",
    "medicinalProperties": [
      "Antimicrobial",
      "Antioxidant",
      "Supports digestion"
    ],
    "traditionalUses": [
      "Tea for colds",
      "Cooking"
    ],
    "sideEffects": [
      "Heartburn",
      "Allergy in people sensitive to the mint family"
    ],
    "precautions": [
      "Do not take the oil during pregnancy",
      "May affect blood clotting at high doses"
    ],
    "lookalikes": [
      "Marjoram looks similar but is milder"
    ],
    "otherNames": [
      "Wild marjoram",
      "Origanum"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Steep dried leaves in hot water for 5–10 minutes",
      "Sprinkle on pizza, pasta, salads and soups"
    ],
    "forms": [
      "Fresh leaves",
      "Dried herb",
      "Cooking oil",
      "Capsules"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "sage",
    "commonName": "Sage",
    "scientificName": "Salvia officinalis",
    "family": "Lamiaceae",
    "categories": [
      "respiratory",
      "digestion"
    ],
    "tagline": "Throat-soothing garden sage",
    "summary": "An aromatic shrub used as a gargle for sore throats and to ease digestion and excessive sweating.",
    "verdict": "caution",
    "verdictReason": "Fine in food and short-term tea, but large amounts contain thujone, which is harmful.",
    "medicinalProperties": [
      "Antimicrobial",
      "Astringent",
      "Digestive aid"
    ],
    "traditionalUses": [
      "Gargle for sore throat",
      "Tea after heavy meals"
    ],
    "sideEffects": [
      "Dizziness",
      "Restlessness in large doses"
    ],
    "precautions": [
      "Avoid in pregnancy and breastfeeding",
      "Do not use the essential oil internally",
      "Limit tea to a few cups a day"
    ],
    "lookalikes": [
      "Clary sage and other Salvia species are different"
    ],
    "otherNames": [
      "Garden sage",
      "Common sage"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Steep 1 tsp dried leaves in hot water for 5 minutes",
      "Gargle with cooled tea for a sore throat"
    ],
    "forms": [
      "Fresh leaves",
      "Dried herb",
      "Tea",
      "Lozenges"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "rosemary",
    "commonName": "Rosemary",
    "scientificName": "Salvia rosmarinus",
    "family": "Lamiaceae",
    "categories": [
      "digestion",
      "immunity",
      "pain"
    ],
    "tagline": "Memory-boosting herb",
    "summary": "A woody Mediterranean herb used in cooking and traditionally to support memory, circulation and digestion.",
    "verdict": "safe",
    "verdictReason": "Safe in food and tea amounts.",
    "medicinalProperties": [
      "Antioxidant",
      "Stimulates digestion",
      "Improves circulation"
    ],
    "traditionalUses": [
      "Rosemary tea",
      "Scalp and muscle rubs"
    ],
    "sideEffects": [
      "Stomach irritation",
      "Skin allergy"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy",
      "Caution with blood thinners"
    ],
    "lookalikes": [],
    "otherNames": [
      "Rosmarinus",
      "Dew of the sea"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Leaves",
      "Flowering tops"
    ],
    "howToUse": [
      "Steep a sprig in hot water for 5–10 minutes",
      "Cook with roasted vegetables and meat",
      "Infuse in oil for a scalp massage"
    ],
    "forms": [
      "Fresh sprigs",
      "Dried herb",
      "Tea",
      "Essential oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "fennel",
    "commonName": "Fennel",
    "scientificName": "Foeniculum vulgare",
    "family": "Apiaceae",
    "categories": [
      "digestion"
    ],
    "tagline": "Seeds for gentle digestion",
    "summary": "Fennel seeds are chewed or brewed to ease gas, bloating and heavy meals.",
    "verdict": "safe",
    "verdictReason": "Safe in food and tea amounts.",
    "medicinalProperties": [
      "Reduces gas and bloating",
      "Antispasmodic",
      "Mild diuretic"
    ],
    "traditionalUses": [
      "Chewed after meals",
      "Fennel tea for colic and gas"
    ],
    "sideEffects": [
      "Sun sensitivity",
      "Allergy in people sensitive to the carrot family"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy",
      "Caution with hormone-sensitive conditions"
    ],
    "lookalikes": [
      "Poison hemlock looks similar to wild fennel. Never forage without expert help"
    ],
    "otherNames": [
      "Saunf",
      "Sweet cumin"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Seeds",
      "Bulb",
      "Leaves"
    ],
    "howToUse": [
      "Chew ½ tsp seeds after meals",
      "Steep 1 tsp crushed seeds in hot water for 10 minutes"
    ],
    "forms": [
      "Seeds",
      "Powder",
      "Tea",
      "Essential oil"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "cardamom",
    "commonName": "Cardamom",
    "scientificName": "Elettaria cardamomum",
    "family": "Zingiberaceae",
    "categories": [
      "digestion",
      "respiratory"
    ],
    "tagline": "The queen of spices",
    "summary": "Aromatic seed pods used in chai and curries and to ease nausea and bad breath.",
    "verdict": "safe",
    "verdictReason": "Safe in food amounts for most people.",
    "medicinalProperties": [
      "Digestive aid",
      "Anti-nausea",
      "Antioxidant"
    ],
    "traditionalUses": [
      "Chai spice",
      "Chewed after meals"
    ],
    "sideEffects": [
      "Rarely, allergic reactions"
    ],
    "precautions": [
      "Avoid large medicinal doses with gallstones or in pregnancy"
    ],
    "lookalikes": [],
    "otherNames": [
      "Elaichi",
      "Green cardamom"
    ],
    "nativeTo": "Southern India and Sri Lanka",
    "partsUsed": [
      "Seed pods"
    ],
    "howToUse": [
      "Crush 2–3 pods into tea, chai or milk",
      "Chew a pod to freshen breath"
    ],
    "forms": [
      "Whole pods",
      "Seeds",
      "Powder",
      "Essential oil"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "cinnamon",
    "commonName": "Cinnamon",
    "scientificName": "Cinnamomum verum",
    "family": "Lauraceae",
    "categories": [
      "digestion",
      "immunity"
    ],
    "tagline": "Warming sweet bark",
    "summary": "The inner bark of a tropical tree used as a spice and in traditional remedies for digestion and blood sugar.",
    "verdict": "safe",
    "verdictReason": "Safe in food amounts. Prefer true (Ceylon) cinnamon for daily use.",
    "medicinalProperties": [
      "Antioxidant",
      "May help blood sugar",
      "Warming"
    ],
    "traditionalUses": [
      "Tea and spice",
      "Digestive comfort"
    ],
    "sideEffects": [
      "Mouth irritation",
      "Liver strain from large amounts of cassia"
    ],
    "precautions": [
      "Avoid large supplements in liver disease",
      "Caution with diabetes medicine"
    ],
    "lookalikes": [
      "Cassia cinnamon looks similar but contains more coumarin"
    ],
    "otherNames": [
      "Dalchini",
      "True cinnamon",
      "Ceylon cinnamon"
    ],
    "nativeTo": "Sri Lanka",
    "partsUsed": [
      "Inner bark"
    ],
    "howToUse": [
      "Simmer a small stick in water for 10 minutes",
      "Sprinkle powder on porridge, milk or tea"
    ],
    "forms": [
      "Sticks",
      "Powder",
      "Tea",
      "Capsules"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "clove",
    "commonName": "Clove",
    "scientificName": "Syzygium aromaticum",
    "family": "Myrtaceae",
    "categories": [
      "pain",
      "digestion"
    ],
    "tagline": "Numbing spice for toothache",
    "summary": "Dried flower buds with a strong, numbing aroma, used for tooth pain and digestion.",
    "verdict": "caution",
    "verdictReason": "Fine as a spice. Clove oil is strong and toxic if swallowed or overused.",
    "medicinalProperties": [
      "Mild pain relief",
      "Antiseptic",
      "Aids digestion"
    ],
    "traditionalUses": [
      "Chewing a bud for toothache",
      "Spice tea"
    ],
    "sideEffects": [
      "Gum and mouth irritation",
      "Liver toxicity from the oil"
    ],
    "precautions": [
      "Always dilute clove oil",
      "Not for children",
      "Caution with blood thinners"
    ],
    "lookalikes": [],
    "otherNames": [
      "Laung",
      "Lavang"
    ],
    "nativeTo": "Indonesia (the Maluku Islands)",
    "partsUsed": [
      "Dried flower buds"
    ],
    "howToUse": [
      "Add 2–3 buds to tea or rice",
      "Hold one bud gently against a sore tooth (do not swallow oil)"
    ],
    "forms": [
      "Whole buds",
      "Powder",
      "Essential oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "black-pepper",
    "commonName": "Black Pepper",
    "scientificName": "Piper nigrum",
    "family": "Piperaceae",
    "categories": [
      "digestion",
      "respiratory"
    ],
    "tagline": "Spice that boosts absorption",
    "summary": "The most traded spice in the world, which also helps the body absorb other nutrients such as curcumin.",
    "verdict": "safe",
    "verdictReason": "Safe in food amounts.",
    "medicinalProperties": [
      "Stimulates digestion",
      "Boosts absorption",
      "Warming"
    ],
    "traditionalUses": [
      "Warm pepper tea with honey",
      "Cooking"
    ],
    "sideEffects": [
      "Heartburn",
      "Sneezing"
    ],
    "precautions": [
      "Avoid large medicinal amounts with ulcers"
    ],
    "lookalikes": [
      "Long pepper is a related plant"
    ],
    "otherNames": [
      "Kali mirch",
      "King of spices"
    ],
    "nativeTo": "Southern India",
    "partsUsed": [
      "Dried berries (peppercorns)"
    ],
    "howToUse": [
      "Grind fresh over food",
      "Add a pinch to turmeric milk or herbal tea"
    ],
    "forms": [
      "Whole peppercorns",
      "Ground pepper",
      "Oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "coriander",
    "commonName": "Coriander",
    "scientificName": "Coriandrum sativum",
    "family": "Apiaceae",
    "categories": [
      "digestion"
    ],
    "tagline": "Cooling leaf and seed",
    "summary": "Both the leaves (cilantro) and seeds are used to ease digestion and cool the body.",
    "verdict": "safe",
    "verdictReason": "Safe in food amounts.",
    "medicinalProperties": [
      "Digestive aid",
      "Antioxidant",
      "Cooling"
    ],
    "traditionalUses": [
      "Seed water for bloating",
      "Fresh chutney"
    ],
    "sideEffects": [
      "Skin allergy",
      "Sun sensitivity"
    ],
    "precautions": [
      "Caution with blood sugar medicine"
    ],
    "lookalikes": [
      "Poison hemlock and other wild carrot-family plants look similar"
    ],
    "otherNames": [
      "Dhania",
      "Cilantro (leaves)"
    ],
    "nativeTo": "The Mediterranean and Middle East",
    "partsUsed": [
      "Leaves",
      "Seeds"
    ],
    "howToUse": [
      "Soak 1 tsp seeds overnight and drink the strained water",
      "Add fresh leaves to chutneys, dals and salads"
    ],
    "forms": [
      "Fresh leaves",
      "Seeds",
      "Powder"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "cumin",
    "commonName": "Cumin",
    "scientificName": "Cuminum cyminum",
    "family": "Apiaceae",
    "categories": [
      "digestion"
    ],
    "tagline": "Everyday digestive spice",
    "summary": "Roasted cumin seeds are a staple spice used to ease gas and stimulate digestion.",
    "verdict": "safe",
    "verdictReason": "Safe in food amounts.",
    "medicinalProperties": [
      "Aids digestion",
      "Antioxidant",
      "Reduces gas"
    ],
    "traditionalUses": [
      "Jeera water",
      "Spice blends"
    ],
    "sideEffects": [
      "Heartburn",
      "Belching"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy",
      "Caution with diabetes medicine"
    ],
    "lookalikes": [
      "Caraway and fennel seeds look similar"
    ],
    "otherNames": [
      "Jeera",
      "Zeera"
    ],
    "nativeTo": "The Eastern Mediterranean and South Asia",
    "partsUsed": [
      "Seeds"
    ],
    "howToUse": [
      "Boil 1 tsp seeds in water for 5 minutes and sip (jeera water)",
      "Dry roast and add to curries and raita"
    ],
    "forms": [
      "Seeds",
      "Powder"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "fenugreek",
    "commonName": "Fenugreek",
    "scientificName": "Trigonella foenum-graecum",
    "family": "Fabaceae",
    "categories": [
      "digestion",
      "skin"
    ],
    "tagline": "Bitter seeds, many uses",
    "summary": "Seeds and leaves are used in cooking and to support digestion, blood sugar and milk supply.",
    "verdict": "caution",
    "verdictReason": "Safe as food, but medicinal doses affect blood sugar and are not for pregnancy.",
    "medicinalProperties": [
      "Blood sugar support",
      "Soothes digestion",
      "Skin softening"
    ],
    "traditionalUses": [
      "Soaked seeds in the morning",
      "Hair and skin paste"
    ],
    "sideEffects": [
      "Gas and diarrhoea",
      "Maple-syrup body odour"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy",
      "Caution with diabetes medicine and blood thinners",
      "Allergy risk in people allergic to peanuts or chickpeas"
    ],
    "lookalikes": [],
    "otherNames": [
      "Methi",
      "Greek hay"
    ],
    "nativeTo": "The Mediterranean and South Asia",
    "partsUsed": [
      "Seeds",
      "Leaves"
    ],
    "howToUse": [
      "Soak 1 tsp seeds overnight and eat or drink the water in the morning",
      "Cook fresh leaves as methi sabzi or parathas"
    ],
    "forms": [
      "Seeds",
      "Fresh leaves",
      "Dried leaves (kasuri methi)",
      "Powder",
      "Capsules"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "garlic",
    "commonName": "Garlic",
    "scientificName": "Allium sativum",
    "family": "Amaryllidaceae",
    "categories": [
      "immunity",
      "respiratory"
    ],
    "tagline": "Pungent immune bulb",
    "summary": "A kitchen staple used for centuries to fight infections and support heart health.",
    "verdict": "safe",
    "verdictReason": "Safe as food. Supplements and large raw amounts can interact with medicines.",
    "medicinalProperties": [
      "Antimicrobial",
      "Supports heart health",
      "Immune support"
    ],
    "traditionalUses": [
      "Raw crushed clove in food",
      "Warm garlic milk for colds"
    ],
    "sideEffects": [
      "Bad breath",
      "Heartburn",
      "Bleeding risk at high doses"
    ],
    "precautions": [
      "Stop supplements before surgery",
      "Caution with blood thinners"
    ],
    "lookalikes": [
      "Wild garlic can be confused with poisonous lily-of-the-valley"
    ],
    "otherNames": [
      "Lasun",
      "Lahsun"
    ],
    "nativeTo": "Central Asia",
    "partsUsed": [
      "Bulb (cloves)"
    ],
    "howToUse": [
      "Crush a clove and let it rest for 10 minutes, then add to food",
      "Simmer crushed cloves in warm milk"
    ],
    "forms": [
      "Fresh bulbs",
      "Powder",
      "Aged extract",
      "Capsules"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "moringa",
    "commonName": "Moringa (Drumstick)",
    "scientificName": "Moringa oleifera",
    "family": "Moringaceae",
    "categories": [
      "immunity",
      "skin"
    ],
    "tagline": "Drumstick tree superfood",
    "summary": "A fast-growing tree whose leaves, pods and seeds are eaten for protein, vitamins and minerals.",
    "verdict": "safe",
    "verdictReason": "Leaves and pods are safe as food. Avoid the roots and bark.",
    "medicinalProperties": [
      "Nutrient-dense",
      "Antioxidant",
      "Anti-inflammatory"
    ],
    "traditionalUses": [
      "Leaf powder in food",
      "Drumstick pods in curries"
    ],
    "sideEffects": [
      "Loose stools",
      "Stomach upset"
    ],
    "precautions": [
      "Avoid roots and bark, especially in pregnancy",
      "Caution with thyroid and blood pressure medicine"
    ],
    "lookalikes": [],
    "otherNames": [
      "Drumstick tree",
      "Sahjan",
      "Murungai"
    ],
    "nativeTo": "Northern India",
    "partsUsed": [
      "Leaves",
      "Pods",
      "Seeds"
    ],
    "howToUse": [
      "Stir 1 tsp leaf powder into water, smoothies or dal",
      "Cook pods in sambar and curries"
    ],
    "forms": [
      "Fresh pods",
      "Leaf powder",
      "Capsules",
      "Tea"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "calendula",
    "commonName": "Calendula",
    "scientificName": "Calendula officinalis",
    "family": "Asteraceae",
    "categories": [
      "skin"
    ],
    "tagline": "Golden skin healer",
    "summary": "A bright orange marigold whose petals are used in creams and washes for the skin.",
    "verdict": "safe",
    "verdictReason": "Very gentle on skin. Avoid if allergic to the daisy family.",
    "medicinalProperties": [
      "Wound healing",
      "Anti-inflammatory",
      "Soothing"
    ],
    "traditionalUses": [
      "Cream for cuts and chapped skin",
      "Petal rinse for rashes"
    ],
    "sideEffects": [
      "Rash in people allergic to the daisy family"
    ],
    "precautions": [
      "Avoid internal use in pregnancy"
    ],
    "lookalikes": [
      "Common garden marigolds (Tagetes) are different plants"
    ],
    "otherNames": [
      "Pot marigold",
      "Marybud"
    ],
    "nativeTo": "Southern Europe",
    "partsUsed": [
      "Flower petals"
    ],
    "howToUse": [
      "Steep dried petals in hot water and cool for a skin rinse",
      "Apply a calendula cream to clean, dry skin"
    ],
    "forms": [
      "Dried petals",
      "Cream",
      "Infused oil",
      "Tea"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "witch-hazel",
    "commonName": "Witch Hazel",
    "scientificName": "Hamamelis virginiana",
    "family": "Hamamelidaceae",
    "categories": [
      "skin",
      "pain"
    ],
    "tagline": "Astringent for skin",
    "summary": "A shrub whose bark and leaves make a toning liquid for skin, bruises and hemorrhoids.",
    "verdict": "safe",
    "verdictReason": "Safe on skin. Do not drink alcohol-based products.",
    "medicinalProperties": [
      "Astringent",
      "Anti-inflammatory",
      "Cooling"
    ],
    "traditionalUses": [
      "Toner for oily skin",
      "Compress for bruises and bites"
    ],
    "sideEffects": [
      "Skin dryness",
      "Irritation"
    ],
    "precautions": [
      "Do not swallow",
      "Patch test first"
    ],
    "lookalikes": [],
    "otherNames": [
      "Winterbloom"
    ],
    "nativeTo": "North America",
    "partsUsed": [
      "Bark",
      "Leaves"
    ],
    "howToUse": [
      "Dab distilled witch hazel on skin with a cotton pad",
      "Use as a cool compress on bites and bruises"
    ],
    "forms": [
      "Distilled liquid",
      "Pads",
      "Gel"
    ],
    "price": {
      "min": 4,
      "max": 10,
      "unit": "100 ml"
    }
  },
  {
    "slug": "tea-tree",
    "commonName": "Tea Tree",
    "scientificName": "Melaleuca alternifolia",
    "family": "Myrtaceae",
    "categories": [
      "skin",
      "immunity"
    ],
    "tagline": "Antiseptic oil tree",
    "summary": "An Australian tree whose leaf oil is used to treat acne, fungal infections and minor cuts.",
    "verdict": "caution",
    "verdictReason": "Only for use on skin, diluted. Swallowing the oil is toxic.",
    "medicinalProperties": [
      "Antibacterial",
      "Antifungal",
      "Anti-inflammatory"
    ],
    "traditionalUses": [
      "Diluted oil for acne spots",
      "Athlete foot"
    ],
    "sideEffects": [
      "Skin irritation",
      "Allergic rash"
    ],
    "precautions": [
      "Never swallow",
      "Dilute before applying",
      "Toxic to pets, especially cats"
    ],
    "lookalikes": [],
    "otherNames": [
      "Melaleuca",
      "Ti-tree"
    ],
    "nativeTo": "Australia",
    "partsUsed": [
      "Leaf oil"
    ],
    "howToUse": [
      "Dilute 1 drop in 1 tsp of carrier oil, then dab on a spot",
      "Add to a diffuser in a well-ventilated room"
    ],
    "forms": [
      "Essential oil",
      "Creams",
      "Face wash",
      "Shampoo"
    ],
    "price": {
      "min": 5,
      "max": 15,
      "unit": "10 ml oil"
    }
  },
  {
    "slug": "gotu-kola",
    "commonName": "Gotu Kola",
    "scientificName": "Centella asiatica",
    "family": "Apiaceae",
    "categories": [
      "skin",
      "calm"
    ],
    "tagline": "Wound-healing green",
    "summary": "A creeping herb used in Ayurveda and Asian medicine for skin, wounds and calm focus.",
    "verdict": "safe",
    "verdictReason": "Generally well tolerated for short periods.",
    "medicinalProperties": [
      "Wound healing",
      "Calming",
      "Improves circulation"
    ],
    "traditionalUses": [
      "Leaf salad or tea",
      "Cream for scars and stretch marks"
    ],
    "sideEffects": [
      "Skin irritation",
      "Drowsiness"
    ],
    "precautions": [
      "Avoid with liver disease",
      "Not during pregnancy",
      "Stop before surgery"
    ],
    "lookalikes": [
      "Brahmi and pennywort species are often confused with it"
    ],
    "otherNames": [
      "Mandukaparni",
      "Indian pennywort"
    ],
    "nativeTo": "Asia and Africa",
    "partsUsed": [
      "Leaves",
      "Whole herb"
    ],
    "howToUse": [
      "Steep fresh or dried leaves in hot water for 10 minutes",
      "Use fresh leaves in salads and chutney"
    ],
    "forms": [
      "Fresh leaves",
      "Dried herb",
      "Powder",
      "Capsules",
      "Cream"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "hibiscus",
    "commonName": "Hibiscus (Roselle)",
    "scientificName": "Hibiscus sabdariffa",
    "family": "Malvaceae",
    "categories": [
      "immunity",
      "digestion"
    ],
    "tagline": "Tangy ruby tea",
    "summary": "Dried roselle calyces make a tart red tea rich in antioxidants that may help blood pressure.",
    "verdict": "safe",
    "verdictReason": "Safe as tea for most adults.",
    "medicinalProperties": [
      "Antioxidant",
      "May lower blood pressure",
      "Mild diuretic"
    ],
    "traditionalUses": [
      "Hot or cold hibiscus tea",
      "Jams and drinks"
    ],
    "sideEffects": [
      "Low blood pressure",
      "Stomach upset"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Caution with blood pressure medicine"
    ],
    "lookalikes": [],
    "otherNames": [
      "Roselle",
      "Gongura (leaf)",
      "Sorrel"
    ],
    "nativeTo": "West Africa",
    "partsUsed": [
      "Calyces",
      "Leaves"
    ],
    "howToUse": [
      "Steep 1–2 tsp dried calyces in hot water for 5–10 minutes",
      "Chill and serve over ice"
    ],
    "forms": [
      "Dried calyces",
      "Tea bags",
      "Powder",
      "Syrup"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "spearmint",
    "commonName": "Spearmint",
    "scientificName": "Mentha spicata",
    "family": "Lamiaceae",
    "categories": [
      "digestion",
      "respiratory"
    ],
    "tagline": "Milder, sweeter mint",
    "summary": "A gentle mint used in teas, chutneys and to ease nausea and bloating.",
    "verdict": "safe",
    "verdictReason": "Safe in food and tea amounts.",
    "medicinalProperties": [
      "Relieves gas",
      "Cooling",
      "Anti-nausea"
    ],
    "traditionalUses": [
      "Mint tea",
      "Chutney"
    ],
    "sideEffects": [
      "Heartburn"
    ],
    "precautions": [
      "Caution with acid reflux"
    ],
    "lookalikes": [
      "Pennyroyal looks similar and is toxic"
    ],
    "otherNames": [
      "Garden mint"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Steep leaves in hot water for 5 minutes",
      "Blend into chutneys, drinks and raita"
    ],
    "forms": [
      "Fresh leaves",
      "Dried leaves",
      "Tea bags"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "dandelion",
    "commonName": "Dandelion",
    "scientificName": "Taraxacum officinale",
    "family": "Asteraceae",
    "categories": [
      "digestion",
      "skin"
    ],
    "tagline": "Bitter leaf and root",
    "summary": "A common weed whose leaves and roots are eaten and brewed to support digestion and liver health.",
    "verdict": "safe",
    "verdictReason": "Safe as food and tea. Avoid if allergic to the daisy family.",
    "medicinalProperties": [
      "Supports liver and digestion",
      "Mild diuretic",
      "Rich in vitamins"
    ],
    "traditionalUses": [
      "Root tea",
      "Leaves in salad"
    ],
    "sideEffects": [
      "Allergic rash",
      "Heartburn"
    ],
    "precautions": [
      "Avoid with gallstones or bile duct problems",
      "Caution with diuretics and lithium"
    ],
    "lookalikes": [
      "Hawkweed and cat ear look similar but are harmless"
    ],
    "otherNames": [
      "Blowball",
      "Lion's tooth"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Leaves",
      "Root",
      "Flowers"
    ],
    "howToUse": [
      "Roast and simmer the root for 10 minutes as a coffee-like drink",
      "Add young leaves to salads"
    ],
    "forms": [
      "Dried root",
      "Dried leaves",
      "Tea",
      "Capsules"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "milk-thistle",
    "commonName": "Milk Thistle",
    "scientificName": "Silybum marianum",
    "family": "Asteraceae",
    "categories": [
      "digestion",
      "immunity"
    ],
    "tagline": "Liver-friendly thistle",
    "summary": "A spiny purple thistle whose seeds contain silymarin, studied for liver protection.",
    "verdict": "safe",
    "verdictReason": "Generally well tolerated in normal doses.",
    "medicinalProperties": [
      "Liver support",
      "Antioxidant",
      "Anti-inflammatory"
    ],
    "traditionalUses": [
      "Seed extract capsules",
      "Seed tea"
    ],
    "sideEffects": [
      "Mild nausea",
      "Loose stools"
    ],
    "precautions": [
      "Avoid if allergic to the daisy family",
      "Caution with hormone-sensitive conditions"
    ],
    "lookalikes": [],
    "otherNames": [
      "Silybum",
      "Holy thistle"
    ],
    "nativeTo": "The Mediterranean",
    "partsUsed": [
      "Seeds"
    ],
    "howToUse": [
      "Take a standardised seed extract as directed on the label",
      "Grind seeds and add to smoothies"
    ],
    "forms": [
      "Seeds",
      "Capsules",
      "Extract",
      "Tea"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "ginkgo",
    "commonName": "Ginkgo",
    "scientificName": "Ginkgo biloba",
    "family": "Ginkgoaceae",
    "categories": [
      "calm"
    ],
    "tagline": "Ancient memory tree",
    "summary": "One of the oldest tree species on Earth. Its leaf extract is used for memory, focus and circulation.",
    "verdict": "caution",
    "verdictReason": "Can increase bleeding risk and interact with many medicines.",
    "medicinalProperties": [
      "Improves circulation",
      "Antioxidant",
      "May support memory"
    ],
    "traditionalUses": [
      "Standardised leaf extract"
    ],
    "sideEffects": [
      "Headache",
      "Dizziness",
      "Bleeding"
    ],
    "precautions": [
      "Avoid with blood thinners and before surgery",
      "Never eat the seeds raw"
    ],
    "lookalikes": [],
    "otherNames": [
      "Maidenhair tree"
    ],
    "nativeTo": "China",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Take a standardised leaf extract as directed on the label"
    ],
    "forms": [
      "Capsules",
      "Tablets",
      "Tea",
      "Extract"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "ginseng",
    "commonName": "Ginseng",
    "scientificName": "Panax ginseng",
    "family": "Araliaceae",
    "categories": [
      "immunity"
    ],
    "tagline": "Root of vitality",
    "summary": "Panax ginseng root is a classic tonic for energy, stamina and stress in East Asian medicine.",
    "verdict": "caution",
    "verdictReason": "Best for short courses. It can cause insomnia and interact with drugs.",
    "medicinalProperties": [
      "Adaptogenic",
      "Boosts energy",
      "Immune support"
    ],
    "traditionalUses": [
      "Root tea or capsules",
      "Energy tonic"
    ],
    "sideEffects": [
      "Insomnia",
      "Headache",
      "Raised heart rate"
    ],
    "precautions": [
      "Avoid with blood thinners, diabetes or blood pressure medicine",
      "Not for pregnancy"
    ],
    "lookalikes": [
      "American ginseng and Siberian ginseng are different plants"
    ],
    "otherNames": [
      "Korean ginseng",
      "Asian ginseng"
    ],
    "nativeTo": "Korea and northeastern China",
    "partsUsed": [
      "Root"
    ],
    "howToUse": [
      "Simmer 2–3 thin slices in water for 10–15 minutes",
      "Take a standardised extract as directed"
    ],
    "forms": [
      "Dried root",
      "Powder",
      "Capsules",
      "Tea"
    ],
    "price": {
      "min": 15,
      "max": 45,
      "unit": "100 g"
    }
  },
  {
    "slug": "rhodiola",
    "commonName": "Rhodiola",
    "scientificName": "Rhodiola rosea",
    "family": "Crassulaceae",
    "categories": [
      "calm",
      "immunity"
    ],
    "tagline": "Arctic stress fighter",
    "summary": "A hardy mountain plant whose root helps the body handle stress and fatigue.",
    "verdict": "caution",
    "verdictReason": "Generally well tolerated in short courses, but can cause jitteriness.",
    "medicinalProperties": [
      "Adaptogenic",
      "Reduces fatigue",
      "Mood support"
    ],
    "traditionalUses": [
      "Standardised root extract in the morning"
    ],
    "sideEffects": [
      "Jitteriness",
      "Dry mouth",
      "Insomnia"
    ],
    "precautions": [
      "Avoid with bipolar disorder",
      "Not for pregnancy",
      "Do not take late in the day"
    ],
    "lookalikes": [
      "Other Rhodiola species vary in strength"
    ],
    "otherNames": [
      "Golden root",
      "Arctic root",
      "Roseroot"
    ],
    "nativeTo": "Arctic and mountain regions",
    "partsUsed": [
      "Root"
    ],
    "howToUse": [
      "Take a standardised extract in the morning as directed"
    ],
    "forms": [
      "Capsules",
      "Tablets",
      "Extract"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "willow-bark",
    "commonName": "Willow Bark",
    "scientificName": "Salix alba",
    "family": "Salicaceae",
    "categories": [
      "pain"
    ],
    "tagline": "Nature's aspirin",
    "summary": "The bark contains salicin, the compound that inspired aspirin, used for headaches and back pain.",
    "verdict": "caution",
    "verdictReason": "Acts like aspirin: avoid if allergic to aspirin or on blood thinners.",
    "medicinalProperties": [
      "Pain relief",
      "Anti-inflammatory",
      "Fever reducing"
    ],
    "traditionalUses": [
      "Bark tea or extract for headache",
      "Back pain"
    ],
    "sideEffects": [
      "Stomach upset",
      "Bleeding risk"
    ],
    "precautions": [
      "Not for children or teens (Reye syndrome risk)",
      "Avoid with aspirin allergy, ulcers or blood thinners"
    ],
    "lookalikes": [],
    "otherNames": [
      "White willow",
      "Salix"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Bark"
    ],
    "howToUse": [
      "Simmer 1–2 tsp dried bark in water for 10–15 minutes",
      "Take a standardised extract as directed"
    ],
    "forms": [
      "Dried bark",
      "Tea",
      "Capsules",
      "Extract"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "arnica",
    "commonName": "Arnica",
    "scientificName": "Arnica montana",
    "family": "Asteraceae",
    "categories": [
      "pain",
      "skin"
    ],
    "tagline": "Bruise balm from the Alps",
    "summary": "A mountain daisy used in gels and creams for bruises, sprains and sore muscles.",
    "verdict": "caution",
    "verdictReason": "Only for unbroken skin. Swallowing arnica is poisonous.",
    "medicinalProperties": [
      "Anti-inflammatory",
      "Topical pain relief",
      "Reduces bruising"
    ],
    "traditionalUses": [
      "Gel or cream on bruises and sprains"
    ],
    "sideEffects": [
      "Skin irritation",
      "Poisonous if swallowed"
    ],
    "precautions": [
      "Never take internally (except homeopathic dilutions)",
      "Do not apply to broken skin",
      "Avoid if allergic to the daisy family"
    ],
    "lookalikes": [],
    "otherNames": [
      "Mountain arnica",
      "Leopard's bane"
    ],
    "nativeTo": "The mountains of Europe",
    "partsUsed": [
      "Flower heads"
    ],
    "howToUse": [
      "Apply arnica gel or cream to unbroken skin over a bruise",
      "Use as directed and never swallow"
    ],
    "forms": [
      "Gel",
      "Cream",
      "Ointment",
      "Infused oil"
    ],
    "price": {
      "min": 5,
      "max": 14,
      "unit": "50 g gel or cream"
    }
  },
  {
    "slug": "devils-claw",
    "commonName": "Devil's Claw",
    "scientificName": "Harpagophytum procumbens",
    "family": "Pedaliaceae",
    "categories": [
      "pain"
    ],
    "tagline": "African joint herb",
    "summary": "A desert plant whose root is used for arthritis and back pain.",
    "verdict": "caution",
    "verdictReason": "Can cause stomach upset and interact with blood thinners and heart medicines.",
    "medicinalProperties": [
      "Anti-inflammatory",
      "Pain relief",
      "Joint comfort"
    ],
    "traditionalUses": [
      "Root extract for arthritis",
      "Back pain"
    ],
    "sideEffects": [
      "Diarrhoea",
      "Stomach upset",
      "Headache"
    ],
    "precautions": [
      "Avoid with ulcers, gallstones and blood thinners",
      "Not for pregnancy"
    ],
    "lookalikes": [],
    "otherNames": [
      "Grapple plant",
      "Wood spider"
    ],
    "nativeTo": "Southern Africa",
    "partsUsed": [
      "Secondary root (tuber)"
    ],
    "howToUse": [
      "Take a standardised root extract as directed on the label"
    ],
    "forms": [
      "Capsules",
      "Tablets",
      "Extract",
      "Tea"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "boswellia",
    "commonName": "Boswellia (Indian Frankincense)",
    "scientificName": "Boswellia serrata",
    "family": "Burseraceae",
    "categories": [
      "pain",
      "respiratory"
    ],
    "tagline": "Frankincense for joints",
    "summary": "The resin of the Indian frankincense tree is used for arthritis, asthma and inflammation.",
    "verdict": "caution",
    "verdictReason": "Usually well tolerated but may interact with some medicines.",
    "medicinalProperties": [
      "Anti-inflammatory",
      "Joint support",
      "Eases airway inflammation"
    ],
    "traditionalUses": [
      "Resin extract capsules",
      "Incense"
    ],
    "sideEffects": [
      "Nausea",
      "Acid reflux",
      "Diarrhoea"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Caution with anti-inflammatory drugs"
    ],
    "lookalikes": [],
    "otherNames": [
      "Shallaki",
      "Indian frankincense",
      "Salai guggal"
    ],
    "nativeTo": "India",
    "partsUsed": [
      "Gum resin"
    ],
    "howToUse": [
      "Take a standardised resin extract as directed on the label"
    ],
    "forms": [
      "Capsules",
      "Tablets",
      "Resin",
      "Cream"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "mullein",
    "commonName": "Mullein",
    "scientificName": "Verbascum thapsus",
    "family": "Scrophulariaceae",
    "categories": [
      "respiratory"
    ],
    "tagline": "Soft-leaf lung herb",
    "summary": "A tall, velvety plant whose leaves and flowers are brewed for coughs and congestion.",
    "verdict": "safe",
    "verdictReason": "Safe as a strained tea. The fine hairs can irritate the throat if not strained.",
    "medicinalProperties": [
      "Soothes airways",
      "Expectorant",
      "Demulcent"
    ],
    "traditionalUses": [
      "Leaf tea for coughs",
      "Flower oil for earaches"
    ],
    "sideEffects": [
      "Throat irritation if unstrained",
      "Skin rash"
    ],
    "precautions": [
      "Always strain the tea through fine cloth",
      "Avoid the seeds, which are toxic"
    ],
    "lookalikes": [
      "Foxglove leaves look similar and are poisonous"
    ],
    "otherNames": [
      "Great mullein",
      "Verbascum"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Leaves",
      "Flowers"
    ],
    "howToUse": [
      "Steep 1–2 tsp dried leaves in hot water for 10 minutes and strain through a fine cloth"
    ],
    "forms": [
      "Dried leaves",
      "Dried flowers",
      "Tea",
      "Ear oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "marshmallow",
    "commonName": "Marshmallow Root",
    "scientificName": "Althaea officinalis",
    "family": "Malvaceae",
    "categories": [
      "respiratory",
      "digestion",
      "skin"
    ],
    "tagline": "Slippery root for soothing",
    "summary": "The mucilage-rich root coats the throat and gut, easing dryness and irritation.",
    "verdict": "safe",
    "verdictReason": "Generally safe as a cold-infused tea.",
    "medicinalProperties": [
      "Soothes throat",
      "Coats the stomach",
      "Softens skin"
    ],
    "traditionalUses": [
      "Cold-infused root tea",
      "Cough and dry throat"
    ],
    "sideEffects": [
      "Can slow the absorption of medicines"
    ],
    "precautions": [
      "Take medicines an hour apart",
      "Caution with diabetes medicine"
    ],
    "lookalikes": [],
    "otherNames": [
      "Althaea",
      "Mallow"
    ],
    "nativeTo": "Europe and Western Asia",
    "partsUsed": [
      "Root",
      "Leaves"
    ],
    "howToUse": [
      "Soak 1 tbsp dried root in cold water for several hours and strain",
      "Sip the slippery infusion for dryness"
    ],
    "forms": [
      "Dried root",
      "Powder",
      "Tea",
      "Lozenges"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "plantain",
    "commonName": "Plantain Leaf",
    "scientificName": "Plantago major",
    "family": "Plantaginaceae",
    "categories": [
      "skin",
      "respiratory"
    ],
    "tagline": "Roadside first-aid leaf",
    "summary": "A common weed whose leaves are crushed onto stings and cuts and brewed for coughs. Not the banana-like fruit.",
    "verdict": "safe",
    "verdictReason": "Safe as a poultice or tea.",
    "medicinalProperties": [
      "Wound healing",
      "Anti-inflammatory",
      "Soothes cough"
    ],
    "traditionalUses": [
      "Crushed leaf on insect bites",
      "Leaf tea for cough"
    ],
    "sideEffects": [
      "Rare allergy"
    ],
    "precautions": [
      "Wash leaves well and avoid plants growing beside busy roads"
    ],
    "lookalikes": [
      "Foxglove seedlings can look similar. Never eat unidentified leaves"
    ],
    "otherNames": [
      "Broadleaf plantain",
      "Waybread"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Leaves"
    ],
    "howToUse": [
      "Crush a fresh, clean leaf and press it on an insect bite",
      "Steep dried leaves in hot water for 10 minutes"
    ],
    "forms": [
      "Fresh leaves",
      "Dried leaves",
      "Salve",
      "Tea"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "nettle",
    "commonName": "Stinging Nettle",
    "scientificName": "Urtica dioica",
    "family": "Urticaceae",
    "categories": [
      "skin",
      "pain",
      "immunity"
    ],
    "tagline": "Stinging but nourishing",
    "summary": "Cooking or drying removes the sting, leaving a mineral-rich herb used for allergies and joint aches.",
    "verdict": "safe",
    "verdictReason": "Safe once cooked or dried. Fresh leaves sting.",
    "medicinalProperties": [
      "Rich in iron and minerals",
      "Anti-inflammatory",
      "Antihistamine action"
    ],
    "traditionalUses": [
      "Nettle tea or soup",
      "Joint aches"
    ],
    "sideEffects": [
      "Stinging from fresh leaves",
      "Stomach upset"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Caution with blood thinners, diuretics and diabetes medicine"
    ],
    "lookalikes": [
      "Dead-nettle looks similar but does not sting"
    ],
    "otherNames": [
      "Bichu buti",
      "Common nettle"
    ],
    "nativeTo": "Europe, Asia and North America",
    "partsUsed": [
      "Leaves",
      "Root"
    ],
    "howToUse": [
      "Blanch or simmer fresh leaves to remove the sting, then eat like spinach",
      "Steep dried leaves in hot water for 10 minutes"
    ],
    "forms": [
      "Fresh leaves",
      "Dried leaves",
      "Tea",
      "Capsules"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "hops",
    "commonName": "Hops",
    "scientificName": "Humulus lupulus",
    "family": "Cannabaceae",
    "categories": [
      "calm"
    ],
    "tagline": "Beer flower for sleep",
    "summary": "The cone-like flowers used to flavour beer are also brewed or taken to ease restlessness and sleep problems.",
    "verdict": "caution",
    "verdictReason": "Sedating. Not suitable with depression or hormone-sensitive conditions.",
    "medicinalProperties": [
      "Sedative",
      "Anti-anxiety",
      "Digestive bitter"
    ],
    "traditionalUses": [
      "Pillow sachets",
      "Bedtime tea"
    ],
    "sideEffects": [
      "Drowsiness",
      "Low mood"
    ],
    "precautions": [
      "Avoid with depression or hormone-sensitive cancers",
      "Avoid with sedatives",
      "Toxic to dogs"
    ],
    "lookalikes": [],
    "otherNames": [
      "Common hop"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Female flower cones"
    ],
    "howToUse": [
      "Steep 1 tsp dried cones in hot water for 10 minutes",
      "Place dried cones in a small pillow sachet"
    ],
    "forms": [
      "Dried cones",
      "Tea",
      "Capsules",
      "Pillow sachets"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "catnip",
    "commonName": "Catnip",
    "scientificName": "Nepeta cataria",
    "family": "Lamiaceae",
    "categories": [
      "calm",
      "digestion"
    ],
    "tagline": "Not just for cats",
    "summary": "A mint relative that calms people as a tea while exciting cats.",
    "verdict": "safe",
    "verdictReason": "Gentle as tea for most adults.",
    "medicinalProperties": [
      "Mild sedative",
      "Reduces gas",
      "Calming"
    ],
    "traditionalUses": [
      "Bedtime tea",
      "Mild colic and upset stomach"
    ],
    "sideEffects": [
      "Drowsiness",
      "Stomach upset"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Do not take with sedatives"
    ],
    "lookalikes": [],
    "otherNames": [
      "Catmint"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Leaves",
      "Flowers"
    ],
    "howToUse": [
      "Steep 1–2 tsp dried herb in hot water for 10 minutes"
    ],
    "forms": [
      "Dried herb",
      "Tea",
      "Tincture"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "lemongrass",
    "commonName": "Lemongrass",
    "scientificName": "Cymbopogon citratus",
    "family": "Poaceae",
    "categories": [
      "digestion",
      "calm"
    ],
    "tagline": "Citrusy calming grass",
    "summary": "A fragrant tropical grass used in tea, soup and curry to ease digestion and tension.",
    "verdict": "safe",
    "verdictReason": "Safe in food and tea amounts.",
    "medicinalProperties": [
      "Digestive aid",
      "Calming",
      "Antimicrobial"
    ],
    "traditionalUses": [
      "Lemongrass tea",
      "Soups and curries"
    ],
    "sideEffects": [
      "Dry mouth",
      "Dizziness"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy"
    ],
    "lookalikes": [],
    "otherNames": [
      "Nimbu ghas",
      "Gavati chaha"
    ],
    "nativeTo": "South Asia",
    "partsUsed": [
      "Stalks",
      "Leaves"
    ],
    "howToUse": [
      "Bruise 1–2 stalks and simmer in water for 10 minutes",
      "Add to soups, curries and iced tea"
    ],
    "forms": [
      "Fresh stalks",
      "Dried",
      "Tea bags",
      "Essential oil"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "kalmegh",
    "commonName": "Kalmegh (Andrographis)",
    "scientificName": "Andrographis paniculata",
    "family": "Acanthaceae",
    "categories": [
      "immunity",
      "respiratory"
    ],
    "tagline": "The king of bitters",
    "summary": "A very bitter Ayurvedic herb used for fevers, colds and liver support.",
    "verdict": "caution",
    "verdictReason": "Short courses are common, but it can cause allergic reactions and is not for pregnancy.",
    "medicinalProperties": [
      "Immune support",
      "Anti-inflammatory",
      "Liver support"
    ],
    "traditionalUses": [
      "Leaf juice or tea for fever",
      "Colds and sore throat"
    ],
    "sideEffects": [
      "Stomach upset",
      "Headache",
      "Allergic reactions"
    ],
    "precautions": [
      "Avoid in pregnancy and autoimmune disease",
      "Caution with blood thinners"
    ],
    "lookalikes": [],
    "otherNames": [
      "Bhuneem",
      "King of bitters",
      "Andrographis"
    ],
    "nativeTo": "India and Sri Lanka",
    "partsUsed": [
      "Leaves",
      "Whole herb"
    ],
    "howToUse": [
      "Take a standardised extract as directed on the label",
      "Drink a small amount of leaf decoction (very bitter)"
    ],
    "forms": [
      "Dried leaves",
      "Powder",
      "Capsules",
      "Tablets"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "st-johns-wort",
    "commonName": "St John's Wort",
    "scientificName": "Hypericum perforatum",
    "family": "Hypericaceae",
    "categories": [
      "calm"
    ],
    "tagline": "Sunny mood herb",
    "summary": "A yellow-flowered herb used for low mood and mild depression.",
    "verdict": "caution",
    "verdictReason": "Interacts with many medicines, including antidepressants and birth control.",
    "medicinalProperties": [
      "Mood support",
      "Antiviral",
      "Wound healing (topical)"
    ],
    "traditionalUses": [
      "Standardised extract for mild low mood",
      "Infused oil for skin"
    ],
    "sideEffects": [
      "Sun sensitivity",
      "Dry mouth",
      "Dizziness"
    ],
    "precautions": [
      "Never combine with antidepressants",
      "Reduces the effect of birth control and many drugs",
      "Avoid in pregnancy"
    ],
    "lookalikes": [],
    "otherNames": [
      "Hypericum",
      "Klamath weed"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Flowering tops"
    ],
    "howToUse": [
      "Take a standardised extract only after checking medicine interactions",
      "Use infused oil on unbroken skin"
    ],
    "forms": [
      "Capsules",
      "Tablets",
      "Tea",
      "Infused oil"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "comfrey",
    "commonName": "Comfrey",
    "scientificName": "Symphytum officinale",
    "family": "Boraginaceae",
    "categories": [
      "skin",
      "pain"
    ],
    "tagline": "Knitbone for bruises",
    "summary": "A leafy plant used in creams and poultices on bruises, sprains and sore joints.",
    "verdict": "caution",
    "verdictReason": "For unbroken skin only. Swallowing comfrey can seriously harm the liver.",
    "medicinalProperties": [
      "Topical anti-inflammatory",
      "Speeds bruise healing",
      "Soothing"
    ],
    "traditionalUses": [
      "Cream or poultice for sprains"
    ],
    "sideEffects": [
      "Liver damage if swallowed",
      "Skin irritation"
    ],
    "precautions": [
      "Never take internally",
      "Do not use on broken skin or for long periods",
      "Not for pregnancy"
    ],
    "lookalikes": [
      "Foxglove leaves can be confused with comfrey. Never eat either"
    ],
    "otherNames": [
      "Knitbone",
      "Blackwort"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Leaves",
      "Root (external only)"
    ],
    "howToUse": [
      "Apply cream or poultice to unbroken skin only",
      "Never take it by mouth"
    ],
    "forms": [
      "Cream",
      "Ointment",
      "Poultice",
      "Dried leaf (external use)"
    ],
    "price": {
      "min": 5,
      "max": 12,
      "unit": "50 g cream"
    }
  },
  {
    "slug": "yarrow",
    "commonName": "Yarrow",
    "scientificName": "Achillea millefolium",
    "family": "Asteraceae",
    "categories": [
      "skin",
      "digestion"
    ],
    "tagline": "Wound-stopping wildflower",
    "summary": "A feathery wildflower traditionally used to stop bleeding, ease fevers and settle the stomach.",
    "verdict": "caution",
    "verdictReason": "Fine as an occasional tea. It can cause skin reactions and is not for pregnancy.",
    "medicinalProperties": [
      "Astringent",
      "Anti-inflammatory",
      "Digestive bitter"
    ],
    "traditionalUses": [
      "Leaf poultice for small cuts",
      "Tea for fevers and cramps"
    ],
    "sideEffects": [
      "Skin rash",
      "Sun sensitivity"
    ],
    "precautions": [
      "Avoid in pregnancy",
      "Avoid if allergic to the daisy family",
      "Caution with blood thinners"
    ],
    "lookalikes": [
      "Poison hemlock has similar umbrella-shaped flowers and is deadly"
    ],
    "otherNames": [
      "Milfoil",
      "Gandana"
    ],
    "nativeTo": "Europe and Asia",
    "partsUsed": [
      "Flowers",
      "Leaves"
    ],
    "howToUse": [
      "Steep dried flowers in hot water for 5–10 minutes",
      "Apply a crushed fresh leaf to a small scrape"
    ],
    "forms": [
      "Dried flowers",
      "Tea",
      "Tincture",
      "Ointment"
    ],
    "price": {
      "min": 6,
      "max": 15,
      "unit": "100 g"
    }
  },
  {
    "slug": "capsicum",
    "commonName": "Chili Pepper",
    "scientificName": "Capsicum annuum",
    "family": "Solanaceae",
    "categories": [
      "pain",
      "digestion"
    ],
    "tagline": "Chili heat for pain",
    "summary": "Hot chili peppers contain capsaicin, used in creams for nerve and joint pain and to stimulate digestion.",
    "verdict": "safe",
    "verdictReason": "Safe as food. Creams can burn skin and eyes.",
    "medicinalProperties": [
      "Topical pain relief",
      "Stimulates digestion",
      "Warming"
    ],
    "traditionalUses": [
      "Capsaicin cream for joint pain",
      "Spicy meals for congestion"
    ],
    "sideEffects": [
      "Burning sensation",
      "Heartburn"
    ],
    "precautions": [
      "Wash hands after handling",
      "Keep cream away from eyes and broken skin"
    ],
    "lookalikes": [],
    "otherNames": [
      "Lal mirch",
      "Chili",
      "Cayenne"
    ],
    "nativeTo": "Central and South America",
    "partsUsed": [
      "Fruit"
    ],
    "howToUse": [
      "Use fresh or dried chilies in cooking",
      "Apply capsaicin cream to unbroken skin as directed"
    ],
    "forms": [
      "Fresh chilies",
      "Powder",
      "Cream",
      "Capsules"
    ],
    "price": {
      "min": 1,
      "max": 3,
      "unit": "100 g"
    }
  },
  {
    "slug": "jasmine",
    "commonName": "Jasmine",
    "scientificName": "Jasminum officinale",
    "family": "Oleaceae",
    "categories": [
      "calm"
    ],
    "tagline": "Fragrant calming flower",
    "summary": "Sweet-scented flowers used for tea and aromatherapy to relax and lift mood.",
    "verdict": "safe",
    "verdictReason": "Safe as tea and aroma for most people.",
    "medicinalProperties": [
      "Calming",
      "Mood lifting",
      "Antioxidant"
    ],
    "traditionalUses": [
      "Jasmine tea",
      "Aromatherapy"
    ],
    "sideEffects": [
      "Allergy",
      "Headache from strong scent"
    ],
    "precautions": [
      "Dilute concentrated oil before it touches skin"
    ],
    "lookalikes": [
      "Some jasmine-like plants, such as false jasmine, are poisonous"
    ],
    "otherNames": [
      "Chameli",
      "Common jasmine"
    ],
    "nativeTo": "Asia",
    "partsUsed": [
      "Flowers"
    ],
    "howToUse": [
      "Steep dried buds in hot water for 5 minutes",
      "Use jasmine oil diluted in a diffuser"
    ],
    "forms": [
      "Fresh flowers",
      "Dried buds",
      "Tea",
      "Essential oil"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  },
  {
    "slug": "saffron",
    "commonName": "Saffron",
    "scientificName": "Crocus sativus",
    "family": "Iridaceae",
    "categories": [
      "calm"
    ],
    "tagline": "Golden mood spice",
    "summary": "The dried stigmas of a crocus are among the costliest spices in the world, used to lift mood and flavour food.",
    "verdict": "safe",
    "verdictReason": "Safe in culinary amounts. Very large doses are toxic.",
    "medicinalProperties": [
      "Mood support",
      "Antioxidant",
      "Aids sleep"
    ],
    "traditionalUses": [
      "Saffron milk",
      "Rice and desserts"
    ],
    "sideEffects": [
      "Nausea",
      "Dry mouth"
    ],
    "precautions": [
      "Avoid medicinal doses in pregnancy",
      "Large amounts (over 5 g) are dangerous"
    ],
    "lookalikes": [
      "Autumn crocus (Colchicum) is deadly poisonous"
    ],
    "otherNames": [
      "Kesar",
      "Zafran"
    ],
    "nativeTo": "Southwest Asia",
    "partsUsed": [
      "Dried stigmas"
    ],
    "howToUse": [
      "Soak 3–5 threads in warm milk for 10 minutes",
      "Add to rice, desserts and tea"
    ],
    "forms": [
      "Threads",
      "Powder",
      "Tea",
      "Capsules"
    ],
    "price": {
      "min": 5,
      "max": 12,
      "unit": "1 g"
    }
  },
  {
    "slug": "rose",
    "commonName": "Rose",
    "scientificName": "Rosa damascena",
    "family": "Rosaceae",
    "categories": [
      "skin",
      "calm"
    ],
    "tagline": "Petal water for skin and mood",
    "summary": "Fragrant Damask rose petals are used in teas, rose water and skin care for soothing and gentle calm.",
    "verdict": "safe",
    "verdictReason": "Safe as tea and rose water for most people.",
    "medicinalProperties": [
      "Soothing",
      "Antioxidant",
      "Mildly calming"
    ],
    "traditionalUses": [
      "Rose water toner",
      "Petal tea"
    ],
    "sideEffects": [
      "Rare skin allergy"
    ],
    "precautions": [
      "Use only pesticide-free petals"
    ],
    "lookalikes": [],
    "otherNames": [
      "Gulab",
      "Damask rose"
    ],
    "nativeTo": "The Middle East",
    "partsUsed": [
      "Petals",
      "Buds",
      "Rose hips"
    ],
    "howToUse": [
      "Steep dried petals in hot water for 5 minutes",
      "Use rose water as a face toner"
    ],
    "forms": [
      "Dried petals",
      "Rose water",
      "Rose oil",
      "Gulkand"
    ],
    "price": {
      "min": 3,
      "max": 7,
      "unit": "100 g"
    }
  }
];

export const HERBS: Herb[] = RAW.map((h) => ({ ...h, image: IMAGES[h.slug] }));

/** A small hand-picked set used by the Home carousel. */
export const FEATURED_SLUGS = ['tulsi', 'turmeric', 'ashwagandha', 'aloe-vera', 'peppermint', 'ginger', 'neem', 'chamomile'];
export const FEATURED_HERBS: Herb[] = FEATURED_SLUGS.map((s) => HERBS.find((h) => h.slug === s)!).filter(Boolean);

/**
 * Herbs with photos that look great on the big "Herb of the day" card.
 * One per calendar day, in order, cycling through the list.
 */
export const HERB_OF_DAY_SLUGS = [
  'ginger',
  'calendula',
  'echinacea',
  'lavender',
  'st-johns-wort',
  'milk-thistle',
  'hops',
  'saffron',
  'dandelion',
  'brahmi',
];

export function getHerbOfTheDay(date: Date = new Date()): Herb {
  // Local calendar day number, so it switches at the user's midnight.
  const dayNumber = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000);
  const slug = HERB_OF_DAY_SLUGS[dayNumber % HERB_OF_DAY_SLUGS.length];
  return HERBS.find((h) => h.slug === slug) ?? HERBS[0];
}

export function formatPrice(p: Herb['price']) {
  return '$' + p.min + ' – $' + p.max;
}

export function findHerbByScientificName(name: string) {
  const n = name.trim().toLowerCase();
  if (!n) return undefined;
  return HERBS.find((h) => h.scientificName.toLowerCase() === n || n.startsWith(h.scientificName.toLowerCase()));
}

export function getRelatedHerbs(herb: Herb, count = 6) {
  return HERBS.filter((h) => h.slug !== herb.slug && h.categories.some((c) => herb.categories.includes(c))).slice(0, count);
}

export function getHerb(slug: string) {
  return HERBS.find((h) => h.slug === slug);
}

export function categoryCount(key: Category) {
  return HERBS.filter((h) => h.categories.includes(key)).length;
}

export const TIPS = [
  'Never eat a wild plant on a photo ID alone. Confirm with an expert.',
  'Photograph leaf, flower and stem for the best match.',
  'Herbs can interact with medicines. Ask your doctor first.',
];

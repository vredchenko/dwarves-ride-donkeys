import type { HistoricalEvent, DivineEntry } from "./types.ts";

export const TYPE_COLORS: Record<string, string> = {
  domestication: "#c8922a",
  chariot: "#d4a24a",
  cavalry: "#c4543a",
  saddle: "#2a8a5a",
  stirrup: "#3a72b8",
};

export const TYPE_LABELS: Record<string, string> = {
  domestication: "Domestication",
  chariot: "Chariot",
  cavalry: "Cavalry",
  saddle: "Saddle",
  stirrup: "Stirrup",
};

export const EVENTS: HistoricalEvent[] = [
  {
    id: "dereivka",
    year: -3500,
    uncertainty: 300,
    label: "Dereivka / Sredny Stog",
    sublabel: "Riding evidence, SE Ukraine",
    lat: 48.5,
    lng: 34.5,
    type: "domestication",
    description:
      "The Dereivka site in modern Ukraine (Sredny Stog culture) provides contested but widely cited evidence for early horse riding, possibly including a 'cult stallion' with bit-wear patterns. Part of the same broad Pontic steppe horizon as Botai. Central to ongoing debates about where riding first emerged.",
    refs: [
      "Anthony, D.W. (2007). The Horse, the Wheel, and Language. Princeton University Press.",
      "Levine, M. (1999). Botai and the Origins of Horse Domestication. Journal of Anthropological Archaeology, 18(1).",
    ],
  },
  {
    id: "botai",
    year: -3500,
    uncertainty: 300,
    label: "Botai Culture",
    sublabel: "Earliest milking & probable riding",
    lat: 52.8,
    lng: 69.5,
    type: "domestication",
    description:
      "The Botai site in modern Kazakhstan provides the earliest solid evidence for horse domestication — bit-wear on horse teeth and mare's milk residues in pottery. Ancient DNA work (2018) complicates the picture: Botai horses are ancestral to Przewalski's horse, not modern domestic horses, suggesting multiple independent domestication events.",
    refs: [
      "Outram, A.K. et al. (2009). The Earliest Horse Harnessing and Milking. Science, 323(5919), 1332–1335.",
      "Gaunitz, C. et al. (2018). Ancient genomes revisit the ancestry of domestic and Przewalski's horses. Science, 360(6384).",
    ],
  },
  {
    id: "sintashta",
    year: -2100,
    uncertainty: 150,
    label: "Sintashta",
    sublabel: "Origin of the war chariot",
    lat: 53.5,
    lng: 60.5,
    type: "chariot",
    description:
      "The Sintashta culture on the southern Ural steppe produced the earliest known spoke-wheeled war chariots, recovered from elaborate horse-burial complexes. Considered ancestral to Indo-Iranian peoples and the mechanism by which chariot warfare spread into South Asia and the Near East.",
    refs: [
      "Anthony, D.W. (2007). The Horse, the Wheel, and Language. Princeton University Press.",
      "Anthony, D.W. & Vinogradov, N.B. (1995). Birth of the Chariot. Archaeology, 48(2).",
    ],
  },
  {
    id: "hyksos",
    year: -1700,
    uncertainty: 100,
    label: "Hyksos / Egypt",
    sublabel: "Horses & chariots into North Africa",
    lat: 30.8,
    lng: 31.3,
    type: "chariot",
    description:
      "The Hyksos, West Asian conquerors of the Egyptian Nile Delta (Second Intermediate Period), introduced the horse and chariot to North Africa. Egyptian adoption was rapid; the New Kingdom's chariot corps became central to imperial power. The Egyptian word for horse (ssmt) is a Semitic loanword.",
    refs: [
      "Shaw, I. (ed.) (2000). The Oxford History of Ancient Egypt. Oxford University Press.",
      "Spalinger, A. (2005). War in Ancient Egypt: The New Kingdom Period. Blackwell.",
    ],
  },
  {
    id: "assyria",
    year: -880,
    uncertainty: 100,
    label: "Assyrian Cavalry",
    sublabel: "Cavalry begins to replace chariot",
    lat: 36.3,
    lng: 43.0,
    type: "cavalry",
    description:
      "Reliefs at Nimrud and Nineveh document the transition from chariot to cavalry as the primary offensive arm. Early reliefs (~880 BCE) show paired riders — one controlling both horses while the other shoots — evidence that the saddle had not yet made independent mounted archery fully practical.",
    refs: [
      "Littauer, M.A. & Crouwel, J.H. (1979). Wheeled Vehicles and Ridden Animals in the Ancient Near East. Brill.",
      "Reade, J. (1983). Assyrian Sculpture. British Museum Press.",
    ],
  },
  {
    id: "scythian",
    year: -700,
    uncertainty: 100,
    label: "Scythian Culture",
    sublabel: "Full nomadic horse culture, Pontic steppe",
    lat: 47.5,
    lng: 36.5,
    type: "cavalry",
    description:
      "The Scythians developed a fully nomadic horse-based warrior culture across the Pontic steppe. Famous for composite-bow horse archery performed without stirrups — demonstrating that elite riders trained from childhood did not require them. Their animal-style art spread equestrian culture from the Carpathians to the Altai.",
    refs: [
      "Rolle, R. (1989). The World of the Scythians. Batsford.",
      "Cunliffe, B. (2019). The Scythians: Nomad Warriors of the Steppe. Oxford University Press.",
    ],
  },
  {
    id: "pazyryk",
    year: -300,
    uncertainty: 100,
    label: "Pazyryk Burials",
    sublabel: "Earliest preserved saddle",
    lat: 50.2,
    lng: 88.0,
    type: "saddle",
    description:
      "The frozen Pazyryk kurgans in the Altai mountains preserved the world's earliest surviving saddles — sophisticated four-pommel pad constructions with felt covers and girths. The saddle preceded the stirrup by several centuries: it stabilised the seat and enabled sustained mounted archery, leaving the stirrup problem as the next thing to solve.",
    refs: [
      "Rudenko, S.I. (1970). Frozen Tombs of Siberia: The Pazyryk Burials of Iron Age Horsemen. J.M. Dent & Sons.",
      "Polosmak, N.V. (2001). Всадники Укока [Riders of Ukok]. INFOLIO-press, Novosibirsk.",
    ],
  },
  {
    id: "zhao",
    year: -307,
    uncertainty: 5,
    label: "King Wuling of Zhao",
    sublabel: "China formally adopts cavalry",
    lat: 38.0,
    lng: 113.8,
    type: "cavalry",
    description:
      "In 307 BCE, King Wuling of the Zhao state formally adopted 'barbarian' mounted archery and trousers, replacing chariot-based warfare. Recorded precisely in Sima Qian's Shiji. One of the clearest documented moments of deliberate military-cultural technology transfer in ancient history — a king ordering his court to change their clothes and their fighting style.",
    refs: [
      "Sima Qian. Shiji [Records of the Grand Historian], 'Zhao Shijia'. c.91 BCE.",
      "Yates, R.D.S. (2009). Warfare in the Warring States Period. In Cambridge History of China, Vol. 1.",
    ],
  },
  {
    id: "sanchi",
    year: -150,
    uncertainty: 100,
    label: "Sanchi / Bharhut",
    sublabel: "Earliest toe-loop stirrup",
    lat: 23.5,
    lng: 77.7,
    type: "stirrup",
    description:
      "Buddhist reliefs at Sanchi and Bharhut depict riders using a single leather toe loop — the earliest iconographic evidence for any foot support while riding. Suited to barefoot riders in warm climates. Functionally distinct from the later rigid paired stirrup: limited lateral stability, does not enable the shock cavalry tactics the Chinese rigid version made possible.",
    refs: [
      "Azzaroli, A. (1985). An Early History of Horsemanship. E.J. Brill.",
      "Dien, A.E. (1986). The Stirrup and its Effect on Chinese Military History. Ars Orientalis, 16, 33–56.",
    ],
  },
  {
    id: "jin_stirrup",
    year: 302,
    uncertainty: 30,
    label: "Jin Dynasty Stirrup",
    sublabel: "Earliest rigid stirrup",
    lat: 32.0,
    lng: 119.5,
    type: "stirrup",
    description:
      "A single rigid metal stirrup from a Jin dynasty tomb (302 CE) is the earliest archaeological specimen of the rigid stirrup. Paired rigid stirrups appear by c.400–477 CE. This enabled riders to stand, absorb impact, and brace for lance charges. Lynn White Jr. controversially argued the technology caused European feudalism — overstated as monocausal, but the tactical implications were genuinely transformative.",
    refs: [
      "Dien, A.E. (1986). The Stirrup and its Effect on Chinese Military History. Ars Orientalis, 16, 33–56.",
      "White, L. Jr. (1962). Medieval Technology and Social Change. Oxford University Press.",
    ],
  },
  {
    id: "japan",
    year: 430,
    uncertainty: 50,
    label: "Japan",
    sublabel: "Kofun period adoption via Korean peninsula",
    lat: 34.5,
    lng: 135.8,
    type: "cavalry",
    description:
      "Horses arrived in Japan from the Korean peninsula during the Kofun period. Haniwa terracotta figurines depict mounted warriors with saddles and riding equipment. By the Heian period the mounted archer (kisha) was the paradigmatic warrior. The samurai identity was fundamentally cavalry-based long before the Mongol invasions, which brought different tactics but not horsemanship itself.",
    refs: [
      "Friday, K.F. (1992). Hired Swords: The Rise of Private Warrior Power in Early Japan. Stanford University Press.",
      "Farris, W.W. (1992). Heavenly Warriors: The Evolution of Japan's Military, 500–1300. Harvard East Asian Monographs.",
    ],
  },
  {
    id: "avars",
    year: 570,
    uncertainty: 30,
    label: "Avar Khaganate",
    sublabel: "Rigid stirrup arrives in Europe",
    lat: 47.2,
    lng: 19.0,
    type: "stirrup",
    description:
      "The Avars brought the rigid paired stirrup to central Europe in the late 6th century. Their success against Byzantine and Frankish forces prompted rapid adoption. This is the basis for Lynn White Jr.'s 'stirrup thesis' (1962) linking the technology to feudalism — most historians consider the argument overstated, but the technology transfer itself is well documented.",
    refs: [
      "White, L. Jr. (1962). Medieval Technology and Social Change. Oxford University Press.",
      "Pohl, W. (1988). Die Awaren: Ein Steppenvolk im Mitteleuropa, 567–822 n. Chr. C.H. Beck.",
    ],
  },
  {
    id: "islamic",
    year: 640,
    uncertainty: 30,
    label: "Islamic Expansion",
    sublabel: "Cavalry as the vehicle of empire",
    lat: 24.5,
    lng: 45.0,
    type: "cavalry",
    description:
      "Arab cavalry became the primary vehicle of Islamic expansion from the 7th century CE. The Arabian horse became a symbol of military and religious power. Horsemanship vocabulary, breeding knowledge, and sophisticated hippiatric literature spread from Iberia to Central Asia — much of it later translated into Latin, influencing European veterinary practice.",
    refs: [
      "Kennedy, H. (2001). The Armies of the Caliphs: Military and Society in the Early Islamic State. Routledge.",
      "Hyland, A. (1994). The Medieval Warhorse. Sutton Publishing.",
    ],
  },
  {
    id: "americas",
    year: 1519,
    uncertainty: 2,
    label: "Spanish Reintroduction",
    sublabel: "Americas: horses return after 10,000 years",
    lat: 19.4,
    lng: -99.1,
    type: "domestication",
    description:
      "Hernán Cortés landed in Mexico in 1519 with 16 horses, reintroducing the genus Equus to the Americas after an absence of ~10,000 years — they went extinct there at the close of the last Ice Age. The psychological and tactical impact on indigenous populations was immediate and profound.",
    refs: [
      "Díaz del Castillo, B. (1568). Historia Verdadera de la Conquista de la Nueva España.",
      "Denhardt, R.M. (1948). The Horse of the Americas. University of Oklahoma Press.",
    ],
  },
  {
    id: "plains",
    year: 1680,
    uncertainty: 30,
    label: "Plains Nations",
    sublabel: "Fastest adoption in recorded history",
    lat: 41.5,
    lng: -101.5,
    type: "cavalry",
    description:
      "The Pueblo Revolt of 1680 freed large Spanish horse herds in New Mexico. Within two generations, horses spread through Plains nations via trade and raid networks. Comanche, Lakota, Crow, and Blackfoot transformed from pedestrian hunter-gatherers to fully equestrian cultures — one of the most complete cultural transformations in recorded history, accomplished in roughly 50 years.",
    refs: [
      "Hämäläinen, P. (2008). The Comanche Empire. Yale University Press.",
      "West, E. (1998). The Contested Plains. University Press of Kansas.",
    ],
  },
];

export const DIVINE: DivineEntry[] = [
  {
    id: "epona",
    label: "Epona",
    sublabel: "Celtic horse goddess",
    lat: 46.5,
    lng: 3.0,
    description:
      "Celtic goddess of horses, fertility, and the afterlife. Uniquely adopted into the official Roman military pantheon — the only Celtic deity to receive imperial Roman worship. Her cult spread wherever cavalry units were stationed, from Hadrian's Wall to the Danube. Depicted riding sidesaddle surrounded by horses and foals.",
    refs: [
      "Green, M. (1992). Animals in Celtic Life and Myth. Routledge.",
      "Oaks, L.S. (1986). The Goddess Epona. In Pagan Gods and Shrines of the Roman Empire. Oxford University Committee for Archaeology.",
    ],
  },
  {
    id: "poseidon",
    label: "Poseidon Hippios",
    sublabel: "Greek: horses before the sea",
    lat: 37.5,
    lng: 23.5,
    description:
      "Poseidon's association with horses (epithet Hippios) may predate his role as sea god — both connect through ancient conceptions of untameable force. He was said to have created the first horse by striking the earth with his trident. Horse sacrifice to Poseidon was among the most significant Greek ritual acts.",
    refs: ["Burkert, W. (1985). Greek Religion: Archaic and Classical. Harvard University Press."],
  },
  {
    id: "ashvins",
    label: "The Ashvins",
    sublabel: "Vedic divine twin horsemen",
    lat: 25.5,
    lng: 79.0,
    description:
      "Twin Vedic deities of horses, dawn, and medicine. Almost certainly cognate with the Greek Dioscuri and Baltic Dieva dēli — this horse-twin divine archetype is reconstructable to Proto-Indo-European religion, linked to the morning and evening stars and the domestication horizon (~3500 BCE). The oldest surviving divine association with the horse.",
    refs: [
      "Mallory, J.P. & Adams, D.Q. (2006). The Oxford Introduction to Proto-Indo-European. Oxford University Press.",
      "Macdonell, A.A. (1897). Vedic Mythology. Trübner & Co.",
    ],
  },
  {
    id: "sleipnir",
    label: "Sleipnir",
    sublabel: "Odin's eight-legged horse",
    lat: 60.5,
    lng: 14.5,
    description:
      "Odin's eight-legged horse in Norse mythology, born from Loki transformed into a mare. Capable of traversing all nine worlds including Hel. Horses were central to Norse ritual sacrifice (the blót) and burial practice. The eight legs may symbolise a funeral bier's four pallbearers — Sleipnir as psychopomp.",
    refs: [
      "Simek, R. (1993). Dictionary of Northern Mythology. D.S. Brewer.",
      "Lindow, J. (2001). Norse Mythology: A Guide to the Gods, Heroes, Rituals, and Beliefs. Oxford University Press.",
    ],
  },
  {
    id: "hayagriva",
    label: "Hayagriva",
    sublabel: "Horse-headed avatar of Vishnu",
    lat: 22.0,
    lng: 81.5,
    description:
      "Horse-headed avatar of Vishnu in Hindu tradition, associated with knowledge, wisdom, and the recovery of the Vedas. Worshipped particularly in South India and in Tantric traditions. Represents the synthesis of animal power and divine intellect — the horse as bearer of sacred knowledge.",
    refs: [
      "Rao, T.A.G. (1914). Elements of Hindu Iconography, Vol. 1. Law Printing House, Madras.",
    ],
  },
  {
    id: "tianma",
    label: "Tianma 天馬",
    sublabel: "Heavenly Horses of Ferghana",
    lat: 40.5,
    lng: 71.5,
    description:
      "The 'Heavenly Horses' of the Ferghana Valley were considered semi-divine by Han dynasty emperors. Emperor Wu dispatched two costly military expeditions (101 BCE) to obtain them. They were believed to sweat blood and to be capable of ascending to heaven as imperial mounts in the afterlife.",
    refs: [
      "Sima Qian. Shiji, 'Dayuan Liezhuan'. c.91 BCE.",
      "Loewe, M. (1974). Crisis and Conflict in Han China. Allen & Unwin.",
    ],
  },
  {
    id: "dioscuri",
    label: "Dioscuri",
    sublabel: "Castor & Pollux — PIE horse twins",
    lat: 41.9,
    lng: 12.5,
    description:
      "The divine twins Castor (horse-tamer) and Pollux, patrons of horsemen. Their temple in the Roman Forum was used by the equestrian order. Cognate with the Vedic Ashvins and Baltic Dieva dēli — the horse-twin divine archetype is reconstructable to Proto-Indo-European religion, making it one of humanity's oldest attested mythological structures.",
    refs: [
      "Burkert, W. (1985). Greek Religion. Harvard University Press.",
      "Dumézil, G. (1970). Archaic Roman Religion. University of Chicago Press.",
    ],
  },
];

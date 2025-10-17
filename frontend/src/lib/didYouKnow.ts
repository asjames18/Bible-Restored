/**
 * Collection of interesting biblical facts for the "Did You Know?" section
 */

export interface DidYouKnowFact {
  id: string;
  category: 'names' | 'statistics' | 'translation' | 'history' | 'insight';
  fact: string;
  icon?: string;
}

export const didYouKnowFacts: DidYouKnowFact[] = [
  {
    id: 'yahuah-frequency',
    category: 'names',
    fact: 'The name "Yahuah" (יהוה) appears over 6,800 times in the Hebrew Scriptures, making it the most frequently used name for the Most High. Each occurrence represents a direct connection to the divine covenant.',
    icon: '📖'
  },
  {
    id: 'elohiym-plural',
    category: 'names',
    fact: 'The word "Elohiym" (אֱלֹהִים) is grammatically plural but typically takes singular verbs, hinting at the complex unity of the divine nature. It appears over 2,500 times in the Hebrew Bible.',
    icon: '✨'
  },
  {
    id: 'yahusha-meaning',
    category: 'names',
    fact: 'The name "Yahusha" literally means "Yahuah is Salvation." It combines "Yah" (shortened form of Yahuah) with "yasha" (to save), revealing the mission and identity of the Messiah.',
    icon: '🌟'
  },
  {
    id: 'ruach-breath',
    category: 'names',
    fact: 'The Hebrew word "Ruach" (רוּחַ) means wind, breath, or spirit. In Genesis 1:2, the "Ruach Elohiym" (Spirit of God) moved over the waters, showing the life-giving breath of creation.',
    icon: '💨'
  },
  {
    id: 'bible-stats',
    category: 'statistics',
    fact: 'The Bible contains 66 books written by over 40 different authors across approximately 1,500 years, yet maintains remarkable thematic unity and consistency.',
    icon: '📚'
  },
  {
    id: 'psalm-119',
    category: 'statistics',
    fact: 'Psalm 119 is the longest chapter in the Bible with 176 verses. It\'s an acrostic poem where each section corresponds to a letter of the Hebrew alphabet, celebrating the Torah.',
    icon: '✍️'
  },
  {
    id: 'shortest-verse',
    category: 'statistics',
    fact: 'The shortest verse in the Bible is John 11:35: "Jesus wept." Just two words in English, but it reveals the deep compassion and humanity of Yahusha.',
    icon: '💧'
  },
  {
    id: 'middle-verse',
    category: 'statistics',
    fact: 'Psalm 118:8 is considered the middle verse of the Bible: "It is better to trust in Yahuah than to put confidence in man." A powerful central message!',
    icon: '🎯'
  },
  {
    id: 'translators-notes',
    category: 'translation',
    fact: 'The KJV translators added notes in curly braces to show where they added words for English clarity or to provide literal Hebrew meanings. These marginal notes help readers understand translation choices.',
    icon: '📝'
  },
  {
    id: 'tetragrammaton',
    category: 'translation',
    fact: 'The four Hebrew letters YHWH (יהוה), called the Tetragrammaton, were considered too sacred to pronounce by some Jewish traditions. Many English Bibles replaced it with "LORD" in all capitals.',
    icon: '🔤'
  },
  {
    id: 'septuagint',
    category: 'history',
    fact: 'The Septuagint, a Greek translation of the Hebrew Bible completed around 250 BCE, was widely used in the first century and is frequently quoted in the New Testament.',
    icon: '🏛️'
  },
  {
    id: 'dead-sea-scrolls',
    category: 'history',
    fact: 'The Dead Sea Scrolls, discovered in 1947, include copies of biblical texts over 1,000 years older than previously known manuscripts, confirming the remarkable preservation of Scripture.',
    icon: '📜'
  },
  {
    id: 'hebrew-alphabet',
    category: 'insight',
    fact: 'Each letter of the Hebrew alphabet has a numeric value and symbolic meaning. Ancient readers saw layers of meaning in the very letters of Scripture that we miss in translation.',
    icon: '🔢'
  },
  {
    id: 'poetry-proportion',
    category: 'statistics',
    fact: 'Approximately one-third of the Hebrew Bible is poetry, including Psalms, Proverbs, Song of Solomon, and large portions of the prophetic books.',
    icon: '🎵'
  },
  {
    id: 'shema',
    category: 'insight',
    fact: 'The Shema (Deuteronomy 6:4) - "Hear, O Israel: Yahuah our Elohiym, Yahuah is one" - has been the central confession of faith for Hebrews for over 3,000 years.',
    icon: '🕊️'
  },
  {
    id: 'genesis-creation',
    category: 'insight',
    fact: 'The first word of the Bible in Hebrew is "Bereshit" (בְּרֵאשִׁית), meaning "In the beginning." Its first letter, Bet (ב), is the second letter of the alphabet, hinting that creation itself is not the absolute beginning.',
    icon: '🌅'
  },
  {
    id: 'prophetic-books',
    category: 'statistics',
    fact: 'There are 17 prophetic books in the Old Testament. The major prophets (Isaiah, Jeremiah, Ezekiel, Daniel) are called "major" not because they\'re more important, but because they\'re longer!',
    icon: '📢'
  },
  {
    id: 'hallel',
    category: 'insight',
    fact: 'Psalms 113-118, known as the "Hallel" (Praise), were sung during major Jewish festivals. Yahusha likely sang these with His disciples at the Last Supper (Matthew 26:30).',
    icon: '🎶'
  },
  {
    id: 'languages',
    category: 'history',
    fact: 'The Bible has been translated into over 700 languages, with portions available in over 3,000 languages. It remains the most translated book in human history.',
    icon: '🌍'
  },
  {
    id: 'messianic-prophecies',
    category: 'insight',
    fact: 'Scholars have identified over 300 prophecies about the Messiah in the Old Testament. The mathematical probability of one person fulfilling just 48 of them is 1 in 10¹⁵⁷.',
    icon: '⭐'
  },
  {
    id: 'longest-name',
    category: 'names',
    fact: 'The longest name in the Bible is Mahershalalhashbaz (Isaiah 8:1), meaning "swift is the booty, speedy is the prey." It was given as a prophetic sign to Isaiah\'s son.',
    icon: '📛'
  },
  {
    id: 'aramaic-portions',
    category: 'translation',
    fact: 'Parts of Daniel and Ezra were written in Aramaic, not Hebrew. Aramaic was the common language of the Near East during the Babylonian exile.',
    icon: '🗣️'
  },
  {
    id: 'books-66',
    category: 'statistics',
    fact: 'The Protestant Bible has 66 books (39 Old Testament, 27 New Testament), while Catholic Bibles include 7 additional books called the Deuterocanonical books or Apocrypha.',
    icon: '📕'
  },
  {
    id: 'gospel-john-love',
    category: 'statistics',
    fact: 'The Gospel of John mentions "love" more than any other Gospel - over 40 times. John emphasizes that Elohiym is love and that we should love one another.',
    icon: '❤️'
  },
  {
    id: 'bronze-serpent',
    category: 'insight',
    fact: 'The bronze serpent Moses lifted in the wilderness (Numbers 21:9) was a foreshadowing of Yahusha being lifted on the cross, as Yahusha Himself explained in John 3:14-15.',
    icon: '🐍'
  },
  {
    id: 'book-of-job',
    category: 'history',
    fact: 'The Book of Job is considered one of the oldest books in the Bible, possibly written during the time of the patriarchs, even before Moses.',
    icon: '⏳'
  },
  {
    id: 'alpha-omega',
    category: 'names',
    fact: 'Yahusha calls Himself "Alpha and Omega" (Revelation 22:13), the first and last letters of the Greek alphabet, declaring His eternal nature and sovereignty over all history.',
    icon: '🔠'
  },
  {
    id: 'proverbs-31',
    category: 'insight',
    fact: 'Proverbs 31:10-31, the famous passage about the virtuous woman, is an acrostic poem in Hebrew, with each verse beginning with successive letters of the Hebrew alphabet.',
    icon: '👑'
  },
  {
    id: 'ark-dimensions',
    category: 'statistics',
    fact: 'Noah\'s Ark was approximately 450 feet long, 75 feet wide, and 45 feet high - about 1.5 million cubic feet of space, roughly equivalent to 450 semi-trailers!',
    icon: '⛵'
  },
  {
    id: 'book-revelation',
    category: 'statistics',
    fact: 'The Book of Revelation contains over 500 references to the Old Testament, making it deeply rooted in Hebrew Scripture and prophecy.',
    icon: '📜'
  },
  {
    id: 'methuselah-age',
    category: 'statistics',
    fact: 'Methuselah lived 969 years, the longest recorded human lifespan in Scripture. His name prophetically means "when he dies, it shall come" - he died the year of the flood.',
    icon: '👴'
  },
  {
    id: 'paul-epistles',
    category: 'statistics',
    fact: 'Paul wrote 13 epistles (or 14 if you include Hebrews) that comprise about one-third of the New Testament, making him its most prolific author.',
    icon: '✉️'
  },
  {
    id: 'sabbath-rest',
    category: 'insight',
    fact: 'The Hebrew word "Shabbat" (Sabbath) comes from a root meaning "to cease" or "to rest," pointing to both creation rest and the ultimate rest found in Mashiach.',
    icon: '🕊️'
  },
  {
    id: 'women-genealogy',
    category: 'insight',
    fact: 'Matthew\'s genealogy of Yahusha unusually includes four women: Tamar, Rahab, Ruth, and Bathsheba - all Gentiles or associated with scandal, showing Elohiym\'s inclusive grace.',
    icon: '👥'
  },
  {
    id: 'kings-chronicles',
    category: 'history',
    fact: '1&2 Kings and 1&2 Chronicles cover the same historical period but from different perspectives: Kings emphasizes political history, Chronicles focuses on spiritual/priestly matters.',
    icon: '📚'
  },
  {
    id: 'aramaic-daniel',
    category: 'translation',
    fact: 'Daniel 2:4 through 7:28 is written in Aramaic because these chapters contain prophecies primarily concerning Gentile nations and were meant for a wider audience.',
    icon: '🌐'
  },
  {
    id: 'isaiah-messiah',
    category: 'insight',
    fact: 'Isaiah is called the "Fifth Gospel" because it contains more messianic prophecies than any other Old Testament book - at least 50 distinct prophecies about the Messiah.',
    icon: '✝️'
  },
  {
    id: 'book-esther',
    category: 'statistics',
    fact: 'The Book of Esther never explicitly mentions Elohiym or Yahuah, yet His providential hand is evident throughout, demonstrating His sovereignty even in apparent absence.',
    icon: '👸'
  },
  {
    id: 'paul-conversion',
    category: 'history',
    fact: 'Saul\'s conversion on the Damascus road (Acts 9) is so significant it\'s recorded three times in Acts, emphasizing the power of encountering the risen Yahusha.',
    icon: '⚡'
  },
  {
    id: 'temple-construction',
    category: 'statistics',
    fact: 'Solomon\'s Temple took 7 years to build and used 183,000 workers. It stood for about 400 years before being destroyed by Babylon in 586 BC.',
    icon: '⛪'
  },
  {
    id: 'mosaic-law',
    category: 'statistics',
    fact: 'The Torah contains 613 commandments (mitzvot): 248 positive commands and 365 negative commands, covering all aspects of life and worship.',
    icon: '⚖️'
  },
  {
    id: 'gospel-mark',
    category: 'statistics',
    fact: 'The Gospel of Mark is the shortest and most action-packed Gospel, using the word "immediately" 42 times to emphasize the urgency of Yahusha\'s ministry.',
    icon: '⚡'
  },
  {
    id: 'manna-provision',
    category: 'insight',
    fact: 'Yahuah provided manna for Israel for 40 years in the wilderness - about 14,600 days. The manna stopped the day after they entered the Promised Land (Joshua 5:12).',
    icon: '🍞'
  },
  {
    id: 'book-numbers',
    category: 'statistics',
    fact: 'The Book of Numbers gets its name from the two censuses recorded (chapters 1 and 26), but its Hebrew name "Bamidbar" means "In the Wilderness."',
    icon: '🔢'
  },
  {
    id: 'covenant-rainbow',
    category: 'insight',
    fact: 'The rainbow covenant with Noah (Genesis 9) was the first of several biblical covenants. Each divine covenant reveals more of Yahuah\'s redemptive plan.',
    icon: '🌈'
  },
  {
    id: 'book-acts',
    category: 'statistics',
    fact: 'The Book of Acts records the growth of the early church from 120 believers (Acts 1:15) to thousands across the Roman Empire in just 30 years.',
    icon: '📈'
  },
  {
    id: 'genealogy-adam',
    category: 'insight',
    fact: 'The names in the genealogy from Adam to Noah (Genesis 5) form a sentence in Hebrew: "Man appointed mortal sorrow, the blessed Elohiym shall come down teaching, His death shall bring the despairing rest."',
    icon: '📊'
  },
  {
    id: 'nehemiah-wall',
    category: 'statistics',
    fact: 'Nehemiah rebuilt Jerusalem\'s walls in just 52 days (Nehemiah 6:15), a remarkable feat that demonstrated Yahuah\'s power and the people\'s dedication.',
    icon: '🧱'
  },
  {
    id: 'greek-lxx',
    category: 'translation',
    fact: 'The Septuagint (LXX) was translated by 70 Jewish scholars in Alexandria around 250 BC, making it the oldest translation of Hebrew Scripture.',
    icon: '🏛️'
  },
  {
    id: 'zechariah-visions',
    category: 'statistics',
    fact: 'The prophet Zechariah received 8 night visions in a single night (Zechariah 1-6), revealing Yahuah\'s plans for Israel\'s restoration and the coming Messiah.',
    icon: '🌙'
  },
  {
    id: 'census-quirinius',
    category: 'history',
    fact: 'The census mentioned in Luke 2:1-2 that brought Joseph and Mary to Bethlehem has been archaeologically confirmed, validating the Gospel account.',
    icon: '📋'
  },
  {
    id: 'paul-shipwreck',
    category: 'statistics',
    fact: 'Paul was shipwrecked three times (2 Corinthians 11:25), with Acts 27 providing a detailed account of his final shipwreck journey to Rome.',
    icon: '⚓'
  },
  {
    id: 'wilderness-40',
    category: 'insight',
    fact: 'The number 40 appears frequently in Scripture: the flood lasted 40 days, Moses was on Sinai 40 days, Israel wandered 40 years, Yahusha fasted 40 days.',
    icon: '4️⃣'
  },
  {
    id: 'jericho-walls',
    category: 'history',
    fact: 'Archaeological excavations at Jericho have found collapsed walls that fell outward (not inward as typical in sieges), consistent with the biblical account in Joshua 6.',
    icon: '🏯'
  },
  {
    id: 'parable-count',
    category: 'statistics',
    fact: 'Yahusha taught using about 40 parables recorded in the Gospels. Parables were a rabbinical teaching method that revealed truth to the open-hearted while concealing it from the proud.',
    icon: '🌱'
  },
  {
    id: 'tabernacle-gold',
    category: 'statistics',
    fact: 'The Tabernacle used about 1 ton of gold, 3.75 tons of silver, and 2.5 tons of bronze - representing over $40 million in today\'s value!',
    icon: '⛺'
  },
  {
    id: 'passover-lamb',
    category: 'insight',
    fact: 'The Passover lamb had to be without blemish and its bones couldn\'t be broken (Exodus 12:5,46), perfectly foreshadowing Yahusha, the Lamb of Elohiym (John 19:36).',
    icon: '🐑'
  },
  {
    id: 'beatitudes-count',
    category: 'statistics',
    fact: 'The Sermon on the Mount contains 9 Beatitudes (Matthew 5:3-11), each beginning with "Blessed are" and describing the character of kingdom citizens.',
    icon: '⛰️'
  },
  {
    id: 'fish-multiplication',
    category: 'insight',
    fact: 'Yahusha multiplied bread and fish twice: feeding 5,000 men (plus women and children) in Matthew 14, and 4,000 men in Matthew 15, demonstrating His power over creation.',
    icon: '🐟'
  },
  {
    id: 'daniel-70-weeks',
    category: 'insight',
    fact: 'Daniel\'s prophecy of the 70 weeks (Daniel 9:24-27) precisely predicted the timing of the Messiah\'s coming and crucifixion, written 500+ years beforehand.',
    icon: '📅'
  },
  {
    id: 'book-jonah',
    category: 'statistics',
    fact: 'Jonah is quoted or referenced 9 times in the New Testament. Yahusha Himself referenced Jonah\'s 3 days in the fish as a sign of His resurrection (Matthew 12:40).',
    icon: '🐋'
  },
  {
    id: 'fruit-spirit',
    category: 'statistics',
    fact: 'The fruit of the Ruach (Spirit) in Galatians 5:22-23 lists 9 characteristics: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.',
    icon: '🍇'
  },
  {
    id: 'armor-god',
    category: 'insight',
    fact: 'The armor of Elohiym in Ephesians 6:14-17 has 6 pieces, but only one offensive weapon - the sword of the Ruach, which is the word of Elohiym.',
    icon: '⚔️'
  },
  {
    id: 'wilderness-tabernacle',
    category: 'statistics',
    fact: 'Detailed instructions for the Tabernacle appear in 50 chapters of the Bible (13 in Exodus alone), showing the importance of worship according to Yahuah\'s design.',
    icon: '📐'
  },
  {
    id: 'babel-languages',
    category: 'history',
    fact: 'At the Tower of Babel, Yahuah confused human language (Genesis 11:9). At Pentecost, He reversed this by enabling the disciples to speak in many languages (Acts 2).',
    icon: '🗼'
  },
  {
    id: 'high-priest-garments',
    category: 'insight',
    fact: 'The high priest\'s breastplate had 12 precious stones representing the 12 tribes of Israel, worn over his heart, symbolizing that the priest carried the people before Yahuah.',
    icon: '💎'
  },
  {
    id: 'paul-damascus',
    category: 'statistics',
    fact: 'Paul spent about 3 years in Arabia after his Damascus road conversion (Galatians 1:17-18), likely studying Scripture in light of his encounter with Yahusha.',
    icon: '🏜️'
  },
  {
    id: 'prophets-major-minor',
    category: 'statistics',
    fact: 'The "minor prophets" aren\'t less important - they\'re shorter! Together, the 12 minor prophets (Hosea through Malachi) equal the length of Isaiah.',
    icon: '📖'
  },
  {
    id: 'pentateuch-moses',
    category: 'history',
    fact: 'The first five books (Pentateuch/Torah) are traditionally attributed to Moses, who wrote about events spanning from creation (Genesis 1) to his own death (Deuteronomy 34).',
    icon: '📜'
  },
  {
    id: 'gideon-army',
    category: 'statistics',
    fact: 'Yahuah reduced Gideon\'s army from 32,000 to just 300 men (Judges 7:3-7) to ensure Israel knew the victory came from Him, not their own strength.',
    icon: '🎺'
  },
  {
    id: 'chapter-verse',
    category: 'history',
    fact: 'The Bible wasn\'t originally divided into chapters and verses. Chapters were added in 1227 AD and verses in 1551 AD to make Scripture easier to reference.',
    icon: '🔢'
  },
  {
    id: 'abraham-covenant',
    category: 'insight',
    fact: 'Yahuah\'s covenant with Abraham involved cutting animals in half. When Yahuah alone passed through (Genesis 15:17), He was making an unconditional promise.',
    icon: '🔥'
  },
  {
    id: 'melchizedek-mystery',
    category: 'insight',
    fact: 'Melchizedek appears only twice in the Old Testament (Genesis 14, Psalm 110) but is extensively discussed in Hebrews 7 as a type of Yahusha\'s eternal priesthood.',
    icon: '👑'
  },
  {
    id: 'jubilee-year',
    category: 'insight',
    fact: 'The Year of Jubilee occurred every 50 years (Leviticus 25), when debts were forgiven and property returned - a beautiful picture of redemption and restoration.',
    icon: '🎉'
  },
  {
    id: 'twelve-tribes',
    category: 'statistics',
    fact: 'The 12 tribes of Israel are listed differently in various places because Levi (the priestly tribe) sometimes replaces Joseph, who was divided into Ephraim and Manasseh.',
    icon: '🏕️'
  },
  {
    id: 'trinity-hints',
    category: 'insight',
    fact: 'The word "Elohiym" is grammatically plural, and Yahuah refers to Himself as "us" (Genesis 1:26, 11:7), hinting at the triune nature revealed in the New Testament.',
    icon: '🔺'
  },
  {
    id: 'golden-calf',
    category: 'history',
    fact: 'While Moses received the Ten Commandments on Mount Sinai, Israel made a golden calf (Exodus 32). Despite this sin, Yahuah\'s covenant mercy prevailed.',
    icon: '🐮'
  },
  {
    id: 'cyprus-barnabas',
    category: 'history',
    fact: 'Barnabas was from Cyprus (Acts 4:36), and he and Paul later evangelized the island (Acts 13:4-12). Archaeological evidence confirms early Christian presence there.',
    icon: '🏝️'
  },
  {
    id: 'book-lamentations',
    category: 'statistics',
    fact: 'Lamentations has 5 chapters, with chapters 1-4 being acrostic poems based on the Hebrew alphabet. Chapter 3 is a triple acrostic with 66 verses.',
    icon: '😢'
  },
  {
    id: 'greatest-commandment',
    category: 'insight',
    fact: 'When asked about the greatest commandment, Yahusha quoted the Shema (Deuteronomy 6:4-5) and Leviticus 19:18, showing love for Elohiym and neighbor as Torah\'s foundation.',
    icon: '💕'
  },
  {
    id: 'lord-prayer',
    category: 'statistics',
    fact: 'The Lord\'s Prayer (Matthew 6:9-13) contains just 66 words in Greek and addresses 7 key petitions, serving as a model for all prayer.',
    icon: '🙏'
  },
  {
    id: 'seventy-elders',
    category: 'statistics',
    fact: 'Moses appointed 70 elders to help lead Israel (Numbers 11:16). Later, Yahusha sent out 70 disciples (Luke 10:1), echoing this leadership structure.',
    icon: '👥'
  },
  {
    id: 'sarah-age',
    category: 'statistics',
    fact: 'Sarah was 90 years old when she gave birth to Isaac (Genesis 17:17), demonstrating that nothing is impossible with Yahuah.',
    icon: '👶'
  },
  {
    id: 'david-psalms',
    category: 'statistics',
    fact: 'Of the 150 Psalms, 73 are attributed to David. The Psalms cover every human emotion and circumstance, making them timeless expressions of worship and prayer.',
    icon: '🎵'
  },
  {
    id: 'tax-collectors',
    category: 'insight',
    fact: 'Matthew (also called Levi) was a tax collector - despised by Jews for working with Rome. His inclusion as a disciple showed Yahusha\'s heart for outcasts.',
    icon: '💰'
  },
  {
    id: 'vine-branches',
    category: 'insight',
    fact: 'In John 15:5, Yahusha calls Himself the vine and believers the branches. This imagery comes from Isaiah 5 and Psalm 80, which describe Israel as Yahuah\'s vineyard.',
    icon: '🍇'
  },
  {
    id: 'bronze-sea',
    category: 'statistics',
    fact: 'The bronze sea in Solomon\'s temple held about 11,500 gallons of water (1 Kings 7:26), used for priestly washings, symbolizing spiritual cleansing.',
    icon: '🌊'
  },
  {
    id: 'emmaus-road',
    category: 'insight',
    fact: 'On the Emmaus road, the risen Yahusha explained how all Scripture pointed to Him (Luke 24:27), showing the Old Testament is fundamentally about the Messiah.',
    icon: '🚶'
  },
  {
    id: 'sinai-commandments',
    category: 'statistics',
    fact: 'Yahuah gave the Ten Commandments twice: first on stone tablets Moses broke (Exodus 32:19), then on replacement tablets stored in the Ark (Exodus 34:1-28).',
    icon: '📜'
  },
  {
    id: 'woman-well',
    category: 'insight',
    fact: 'The Samaritan woman at the well (John 4) had been married 5 times. Yahusha\'s conversation with her broke three social barriers: gender, ethnicity, and moral status.',
    icon: '💧'
  },
  {
    id: 'holy-holy-holy',
    category: 'insight',
    fact: 'Only one attribute of Elohiym is repeated three times in Scripture: "Holy, Holy, Holy" (Isaiah 6:3, Revelation 4:8), emphasizing His absolute purity and transcendence.',
    icon: '✨'
  },
  {
    id: 'babel-seventy',
    category: 'history',
    fact: 'Genesis 10 lists 70 nations descended from Noah. Jewish tradition says 70 languages came from Babel, which is why Moses appointed 70 elders and Yahusha sent 70 disciples.',
    icon: '🌍'
  },
  {
    id: 'book-philippians',
    category: 'statistics',
    fact: 'Paul wrote Philippians from prison (likely in Rome), yet uses the words "joy" and "rejoice" 16 times, making it the most joyful of his prison epistles.',
    icon: '😊'
  },
  {
    id: 'burning-bush',
    category: 'insight',
    fact: 'At the burning bush, Yahuah revealed His name "I AM" (Exodus 3:14). Later, Yahusha used "I AM" 7 times in John\'s Gospel, claiming divine identity.',
    icon: '🔥'
  },
  {
    id: 'urim-thummim',
    category: 'history',
    fact: 'The Urim and Thummim were objects used by the high priest to discern Yahuah\'s will (Exodus 28:30). Their exact nature remains a mystery.',
    icon: '🎲'
  },
  {
    id: 'forty-two-generations',
    category: 'statistics',
    fact: 'Matthew arranges Yahusha\'s genealogy into three sets of 14 generations (Matthew 1:17), creating a structured pattern from Abraham to Mashiach.',
    icon: '🌳'
  },
  {
    id: 'song-moses',
    category: 'statistics',
    fact: 'Moses wrote two songs recorded in Scripture: Exodus 15 (after the Red Sea crossing) and Deuteronomy 32 (his farewell song), both celebrating Yahuah\'s faithfulness.',
    icon: '🎶'
  },
  {
    id: 'remnant-theology',
    category: 'insight',
    fact: 'Throughout Scripture, Yahuah preserves a faithful remnant: 8 in Noah\'s ark, 7,000 in Elijah\'s time (1 Kings 19:18), and a remnant in Paul\'s day (Romans 11:5).',
    icon: '🌾'
  },
  {
    id: 'synagogue-origin',
    category: 'history',
    fact: 'Synagogues developed during the Babylonian exile when the Temple was destroyed, providing local places for Scripture reading and prayer.',
    icon: '🕍'
  },
  {
    id: 'lots-purim',
    category: 'history',
    fact: 'The Jewish festival of Purim celebrates Esther\'s deliverance. "Purim" means "lots," referring to Haman\'s casting lots to determine when to destroy the Jews (Esther 3:7).',
    icon: '🎭'
  },
  {
    id: 'paul-tentmaker',
    category: 'history',
    fact: 'Paul was a tentmaker by trade (Acts 18:3). He often supported himself while preaching, refusing payment to avoid being a burden to new churches.',
    icon: '⛺'
  },
  {
    id: 'magi-gifts',
    category: 'insight',
    fact: 'The magi\'s three gifts had symbolic meaning: gold for royalty, frankincense for deity, and myrrh for burial - prophetically declaring who Yahusha was and what He would do.',
    icon: '🎁'
  },
  {
    id: 'seven-churches',
    category: 'statistics',
    fact: 'Revelation addresses 7 churches in Asia Minor (Revelation 2-3). These were real historical churches but also represent different conditions in churches throughout history.',
    icon: '🏛️'
  },
  {
    id: 'david-goliath',
    category: 'statistics',
    fact: 'Goliath was over 9 feet tall (1 Samuel 17:4). David chose 5 smooth stones for his sling - some believe because Goliath had 4 brothers (2 Samuel 21:22).',
    icon: '🗿'
  },
  {
    id: 'leviticus-love',
    category: 'insight',
    fact: 'While Leviticus is known for laws, it also contains "Love your neighbor as yourself" (Leviticus 19:18), which Yahusha called one of the two greatest commandments.',
    icon: '❤️'
  },
  {
    id: 'mount-transfiguration',
    category: 'insight',
    fact: 'At the Transfiguration, Moses (representing the Law) and Elijah (representing the Prophets) appeared with Yahusha, showing He fulfills all Scripture (Matthew 17:3).',
    icon: '⛰️'
  },
  {
    id: 'pentecost-harvest',
    category: 'insight',
    fact: 'Pentecost (Shavuot) was a harvest festival. The Ruach came on Pentecost (Acts 2) initiating the great harvest of souls, with 3,000 saved that first day.',
    icon: '🌾'
  },
  {
    id: 'feast-tabernacles',
    category: 'insight',
    fact: 'During the Feast of Tabernacles, when water was poured out, Yahusha declared "If anyone thirsts, let him come to Me and drink" (John 7:37-38).',
    icon: '💦'
  },
  {
    id: 'cornelius-gentiles',
    category: 'history',
    fact: 'Cornelius (Acts 10) was the first Gentile convert, marking a pivotal moment when the Gospel officially extended beyond Jewish boundaries.',
    icon: '🚪'
  },
  {
    id: 'sodom-gomorrah',
    category: 'history',
    fact: 'Archaeological evidence suggests the cities of Sodom and Gomorrah were located near the Dead Sea and were destroyed by a natural disaster around 1900 BC, consistent with Genesis 19.',
    icon: '🔥'
  },
  {
    id: 'good-samaritan',
    category: 'insight',
    fact: 'The Good Samaritan parable (Luke 10:25-37) was shocking because Samaritans were despised by Jews. Yahusha used it to redefine "neighbor" beyond ethnic boundaries.',
    icon: '🤝'
  },
  {
    id: 'scribes-sopherim',
    category: 'history',
    fact: 'The Sopherim (Jewish scribes) counted every letter of Scripture when copying. The middle letter of the Torah is the "vav" in Leviticus 11:42.',
    icon: '✍️'
  },
  {
    id: 'seven-sayings',
    category: 'statistics',
    fact: 'Yahusha spoke seven sayings from the cross, each fulfilling prophecy and revealing His mission: forgiveness, salvation, relationship, suffering, thirst, completion, and trust.',
    icon: '✝️'
  },
  {
    id: 'sanhedrin-council',
    category: 'history',
    fact: 'The Sanhedrin was the Jewish supreme court with 70 members (plus the high priest). They tried Yahusha but lacked authority to execute, requiring Roman approval.',
    icon: '⚖️'
  },
  {
    id: 'mary-magdalene',
    category: 'insight',
    fact: 'Mary Magdalene was the first witness of the resurrection (John 20:11-18). In a culture where women\'s testimony wasn\'t valued, Yahusha chose her to proclaim His victory.',
    icon: '🌅'
  },
  {
    id: 'book-ruth',
    category: 'insight',
    fact: 'Ruth, a Moabite convert, became the great-grandmother of King David and is in Yahusha\'s genealogy (Matthew 1:5), showing Gentiles were always part of Yahuah\'s plan.',
    icon: '💝'
  },
  {
    id: 'thessalonians-first',
    category: 'history',
    fact: '1 Thessalonians, written around 50 AD, is likely Paul\'s earliest epistle and thus possibly the first book of the New Testament to be written.',
    icon: '📮'
  },
  {
    id: 'john-beloved',
    category: 'insight',
    fact: 'John referred to himself as "the disciple whom Yahusha loved" five times, not from pride but from wonder that the Son of Elohiym would love him.',
    icon: '💙'
  },
  {
    id: 'talents-parable',
    category: 'insight',
    fact: 'In the parable of the talents (Matthew 25:14-30), a talent was worth about 20 years of wages - roughly $1 million today. The parable emphasizes faithful stewardship.',
    icon: '💎'
  },
  {
    id: 'balaam-donkey',
    category: 'insight',
    fact: 'Balaam\'s donkey spoke (Numbers 22:28-30), one of only two animals in Scripture to talk (the other being the serpent in Eden), showing Yahuah can use anything.',
    icon: '🐴'
  },
  {
    id: 'faith-hebrews',
    category: 'statistics',
    fact: 'Hebrews 11, the "Hall of Faith," mentions 16 Old Testament heroes by name, demonstrating that faith has always been the path to righteousness.',
    icon: '🏆'
  },
  {
    id: 'book-haggai',
    category: 'statistics',
    fact: 'Haggai is one of the shortest prophetic books with only 2 chapters, but it motivated the Jews to complete rebuilding the Temple in 516 BC.',
    icon: '🏗️'
  },
  {
    id: 'isaac-sacrifice',
    category: 'insight',
    fact: 'Abraham\'s near-sacrifice of Isaac (Genesis 22) occurred on Mount Moriah, the same location where Solomon later built the Temple - and where Yahusha was crucified.',
    icon: '🏔️'
  },
  {
    id: 'shepherd-psalm',
    category: 'insight',
    fact: 'Psalm 23, the Shepherd Psalm, perfectly mirrors the Hebrew shepherd\'s day: morning pasture (v1-2), midday water (v2), evening return (v3-4), night protection (v5-6).',
    icon: '🐑'
  },
  {
    id: 'lot-wife',
    category: 'insight',
    fact: 'Lot\'s wife looked back at Sodom and became a pillar of salt (Genesis 19:26). Yahusha used her as a warning: "Remember Lot\'s wife" (Luke 17:32).',
    icon: '🧂'
  },
  {
    id: 'census-david',
    category: 'history',
    fact: 'David\'s unauthorized census (2 Samuel 24) was taken on the threshing floor of Araunah - the site that became the Temple mount, where mercy met judgment.',
    icon: '📊'
  },
  {
    id: 'seamless-robe',
    category: 'insight',
    fact: 'Yahusha\'s seamless robe (John 19:23) was woven from top to bottom, similar to the high priest\'s garment, indicating His high priestly role.',
    icon: '👔'
  },
  {
    id: 'ravens-elijah',
    category: 'insight',
    fact: 'Yahuah sent ravens to feed Elijah (1 Kings 17:4). Ravens are unclean birds and scavengers, yet Yahuah used them to sustain His prophet.',
    icon: '🦅'
  },
  {
    id: 'fish-coin',
    category: 'insight',
    fact: 'When tax collectors asked Peter about the Temple tax, Yahusha sent him to catch a fish with a coin in its mouth (Matthew 17:27) - showing His sovereignty over creation.',
    icon: '🐟'
  },
  {
    id: 'caleb-faithful',
    category: 'statistics',
    fact: 'Caleb was 40 when he spied out Canaan, wandered 40 years, and at 85 said "I am as strong today as I was then" (Joshua 14:10-11) - rewarded for faithfulness.',
    icon: '💪'
  },
  {
    id: 'love-chapter',
    category: 'insight',
    fact: '1 Corinthians 13, the "Love Chapter," defines love with 15 characteristics. Without love, even the greatest spiritual gifts are meaningless.',
    icon: '💕'
  },
  {
    id: 'nicodemus-night',
    category: 'insight',
    fact: 'Nicodemus came to Yahusha "by night" (John 3:2), possibly from fear but symbolic of his spiritual darkness. Later he boldly defended Yahusha (John 7:50-51).',
    icon: '🌙'
  },
  {
    id: 'widow-mite',
    category: 'insight',
    fact: 'The widow gave two mites (Mark 12:42), worth about 1/64 of a day\'s wage. Yahusha said she gave more than the rich because she gave everything.',
    icon: '🪙'
  },
  {
    id: 'solomons-wisdom',
    category: 'statistics',
    fact: 'Solomon spoke 3,000 proverbs and wrote 1,005 songs (1 Kings 4:32). He wrote Proverbs, Ecclesiastes, and Song of Solomon, plus Psalms 72 and 127.',
    icon: '👑'
  },
  {
    id: 'valley-bones',
    category: 'insight',
    fact: 'Ezekiel\'s vision of dry bones (Ezekiel 37) prophesied Israel\'s restoration. The bones came together, received flesh, then breath - body, soul, spirit.',
    icon: '🦴'
  },
  {
    id: 'handwriting-wall',
    category: 'insight',
    fact: 'The "handwriting on the wall" (Daniel 5:5) appeared during Belshazzar\'s feast. "Mene, Mene, Tekel, Upharsin" predicted Babylon\'s fall that very night.',
    icon: '✋'
  },
  {
    id: 'doubting-thomas',
    category: 'insight',
    fact: 'Thomas doubted the resurrection but made the greatest confession: "My Master and my Elohiym!" (John 20:28), explicitly declaring Yahusha\'s deity.',
    icon: '🤲'
  },
  {
    id: 'priscilla-aquila',
    category: 'insight',
    fact: 'Priscilla and Aquila are always mentioned together in Acts and Paul\'s letters, modeling a godly partnership in marriage and ministry.',
    icon: '👫'
  },
  {
    id: 'nehemiah-cupbearer',
    category: 'history',
    fact: 'Nehemiah was cupbearer to King Artaxerxes, a highly trusted position. His access to the king enabled him to rebuild Jerusalem\'s walls.',
    icon: '🍷'
  },
  {
    id: 'alabaster-box',
    category: 'insight',
    fact: 'The woman who anointed Yahusha with costly perfume (Mark 14:3) broke the alabaster box - she couldn\'t reuse it, symbolizing total surrender.',
    icon: '💐'
  },
  {
    id: 'year-release',
    category: 'insight',
    fact: 'Every seventh year was a Sabbath year when debts were canceled and land rested (Deuteronomy 15:1-2), teaching dependence on Yahuah\'s provision.',
    icon: '7️⃣'
  },
  {
    id: 'stephens-sermon',
    category: 'statistics',
    fact: 'Stephen\'s defense before the Sanhedrin (Acts 7) is the longest recorded sermon in Acts, recounting Israel\'s history before declaring them resistant to the Ruach.',
    icon: '📢'
  },
  {
    id: 'book-malachi',
    category: 'history',
    fact: 'Malachi, the last Old Testament book, was written around 430 BC. Then 400 years of prophetic silence followed before John the Baptist.',
    icon: '🔕'
  },
  {
    id: 'wrestling-jacob',
    category: 'insight',
    fact: 'Jacob wrestled with Elohiym all night (Genesis 32:24-30) and was renamed Israel ("struggles with Elohiym"), receiving a limp that made him depend on Yahuah.',
    icon: '🤼'
  },
  {
    id: 'nazareth-despised',
    category: 'insight',
    fact: 'Nathanael asked "Can anything good come from Nazareth?" (John 1:46). Nazareth was insignificant, yet Yahusha being from there fulfilled prophecy (Matthew 2:23).',
    icon: '🏘️'
  },
  {
    id: 'red-sea-crossing',
    category: 'statistics',
    fact: 'Some scholars estimate 2-3 million Israelites crossed the Red Sea. The crossing likely took most of the night, requiring a path about 3-4 miles wide.',
    icon: '🌊'
  },
  {
    id: 'peter-keys',
    category: 'insight',
    fact: 'Yahusha gave Peter "the keys of the kingdom" (Matthew 16:19). Peter used them to open the Gospel to Jews (Acts 2), Samaritans (Acts 8), and Gentiles (Acts 10).',
    icon: '🔑'
  },
  {
    id: 'rock-water',
    category: 'insight',
    fact: 'Moses struck the rock twice for water (Numbers 20:11). Paul says the rock was Mashiach (1 Corinthians 10:4) - struck once at Calvary, never to be struck again.',
    icon: '⛰️'
  },
  {
    id: 'cities-refuge',
    category: 'insight',
    fact: 'The 6 cities of refuge (Numbers 35) provided asylum for accidental killers, picturing how we flee to Mashiach for refuge from judgment.',
    icon: '🏰'
  },
  {
    id: 'shulamite-bride',
    category: 'insight',
    fact: 'Song of Solomon portrays the love between bride and groom. Historically interpreted as picturing Mashiach\'s love for His bride, the church.',
    icon: '💑'
  },
  {
    id: 'cloud-pillar',
    category: 'insight',
    fact: 'The pillar of cloud by day and fire by night (Exodus 13:21) led Israel for 40 years, never leaving them - a constant visible reminder of Yahuah\'s presence.',
    icon: '☁️'
  },
  {
    id: 'zacchaeus-tree',
    category: 'insight',
    fact: 'Zacchaeus, a chief tax collector, climbed a sycamore tree to see Yahusha (Luke 19:1-10). After meeting Yahusha, he gave half his goods to the poor.',
    icon: '🌳'
  },
  {
    id: 'handwriting-paul',
    category: 'statistics',
    fact: 'Paul typically dictated his letters but added personal greetings in his own handwriting (Galatians 6:11). He may have had poor eyesight.',
    icon: '✉️'
  },
  {
    id: 'halleluyah-meaning',
    category: 'names',
    fact: 'The phrase "HalleluYAH" literally means "Praise YAH", not "praise the LORD." Every time you say it, you\'re shouting His true Name.',
    icon: '🎺'
  },
  {
    id: 'letter-j-history',
    category: 'history',
    fact: 'The letter J didn\'t exist until around 1524 A.D. — so names like "Jesus" and "Jehovah" didn\'t exist in the Messiah\'s lifetime.',
    icon: '📝'
  },
  {
    id: 'yahusha-meaning-detailed',
    category: 'names',
    fact: 'The Messiah\'s real Name is YAHUSHA, meaning "YAHUAH saves." His very Name carries the Father\'s power.',
    icon: '⚡'
  },
  {
    id: 'god-title',
    category: 'names',
    fact: 'The word "God" is a title, not a name. In ancient times it was used for many deities — which is why YAHUAH said, "Have no other elohim before Me."',
    icon: '👑'
  },
  {
    id: 'lord-baal',
    category: 'translation',
    fact: 'The word "Lord" traces back to "Baal", meaning "master". The prophets warned Israel not to mix those names (Hosea 2:16-17).',
    icon: '⚠️'
  },
  {
    id: 'natsarim-believers',
    category: 'history',
    fact: 'Early believers weren\'t called "Christians" — they were known as Natsarim or Followers of the Way, meaning guardians or watchmen of the truth.',
    icon: '👁️'
  },
  {
    id: 'church-origin',
    category: 'translation',
    fact: 'The word "church" never appeared in the original Hebrew or Greek texts. It came later from "circe", a pagan root linked to sun worship.',
    icon: '☀️'
  },
  {
    id: 'tanakh-structure',
    category: 'translation',
    fact: 'The Hebrew Scriptures are called the Tanakh — Torah (Law), Nevi\'im (Prophets), and Ketuvim (Writings).',
    icon: '📚'
  },
  {
    id: 'renewed-covenant',
    category: 'insight',
    fact: 'The so-called "New Testament" is actually the Renewed Covenant (Brit Chadashah), built on obedience and faith.',
    icon: '📜'
  },
  {
    id: 'biblical-year',
    category: 'history',
    fact: 'YAHUAH\'s biblical year starts in spring (Abib/Nisan), not in January.',
    icon: '🌸'
  },
  {
    id: 'sabbath-change',
    category: 'history',
    fact: 'The Sabbath was never changed to Sunday by YAHUAH or YAHUSHA — Rome made that change for political control (Daniel 7:25).',
    icon: '📅'
  },
  {
    id: 'yahusha-torah',
    category: 'insight',
    fact: 'When YAHUSHA fasted forty days, He quoted Deuteronomy, proving the Torah still stands.',
    icon: '📖'
  },
  {
    id: 'home-gatherings',
    category: 'history',
    fact: 'The first followers of YAHUSHA gathered in homes, not temples built by empire.',
    icon: '🏠'
  },
  {
    id: 'yahu-names',
    category: 'names',
    fact: 'Names ending in "-Yahu" (like Eliyahu or Yirmeyahu) carry YAHUAH\'s Name — His mark on His people.',
    icon: '✨'
  },
  {
    id: 'israel-gathering',
    category: 'insight',
    fact: 'YAHUAH scattered Israel for disobedience but promised to gather them again — that gathering is happening now.',
    icon: '🌍'
  },
  {
    id: 'malakiym-messengers',
    category: 'translation',
    fact: 'Angels in Hebrew are malakiym, meaning "messengers" — function, not wings.',
    icon: '📨'
  },
  {
    id: 'book-enoch',
    category: 'history',
    fact: 'The book of Enoch was quoted by Jude, showing it was respected long before it was banned.',
    icon: '📕'
  },
  {
    id: 'december-25',
    category: 'history',
    fact: 'YAHUSHA wasn\'t born on December 25th — that date celebrated pagan sun gods.',
    icon: '🎄'
  },
  {
    id: 'amen-meaning',
    category: 'translation',
    fact: 'Amen comes from the Hebrew "Aman", meaning "so be it" — not from Egypt\'s Amun-Ra.',
    icon: '🙌'
  },
  {
    id: 'yahudah-praise',
    category: 'names',
    fact: 'The tribe of Yahudah (Judah) carries the Name YAH — that\'s why praise begins with Judah.',
    icon: '🎶'
  },
  {
    id: 'israel-identity',
    category: 'names',
    fact: 'Israel/Yashar\'el means "He who strives with EL" — it\'s a covenant identity, not a political nation.',
    icon: '🛡️'
  },
  {
    id: 'feasts-eternal',
    category: 'insight',
    fact: 'The Feasts of YAHUAH (Leviticus 23) are eternal appointments — not "Jewish holidays."',
    icon: '📆'
  },
  {
    id: 'passover-yahusha',
    category: 'insight',
    fact: 'Passover pointed to YAHUSHA, the spotless Lamb whose blood delivers.',
    icon: '🐑'
  },
  {
    id: 'ruach-haqodesh',
    category: 'names',
    fact: 'The RUACH HAQODESH means "Set-Apart Spirit", not a separate person.',
    icon: '🕊️'
  },
  {
    id: 'bible-byblos',
    category: 'translation',
    fact: 'Bible comes from Byblos, a pagan city tied to sun worship. Scripture calls itself "the Word of YAHUAH."',
    icon: '📜'
  },
  {
    id: 'twelve-tribes-scattered',
    category: 'insight',
    fact: 'The twelve tribes of Israel were melanated people scattered worldwide — prophecy fulfilled (Deut 28).',
    icon: '🌍'
  },
  {
    id: 'it-is-finished',
    category: 'insight',
    fact: 'When YAHUSHA said, "It is finished," He completed prophecy, not abolished Torah.',
    icon: '✝️'
  },
  {
    id: 'early-symbols',
    category: 'history',
    fact: 'Early believers used symbols like the Menorah and Aleph & Tav, not the cross.',
    icon: '🕎'
  },
  {
    id: 'emunah-faith',
    category: 'translation',
    fact: 'Hebrew "Emunah" (faith) means "active trust" — belief proven by action.',
    icon: '💪'
  },
  {
    id: 'sacred-name',
    category: 'history',
    fact: 'Ancient scrolls had no vowels; the Name YAHUAH was sacred and spoken with reverence.',
    icon: '📜'
  },
  {
    id: 'israel-captivities',
    category: 'history',
    fact: 'Israel\'s captivities — Egypt, Assyria, Babylon, Rome — fulfill the curses of Deuteronomy 28.',
    icon: '⛓️'
  },
  {
    id: 'prophets-repentance',
    category: 'insight',
    fact: 'Prophets preached repentance, not prosperity.',
    icon: '📢'
  },
  {
    id: 'teshuvah-return',
    category: 'translation',
    fact: 'Teshuvah means "return" — repentance is going back to YAH\'s ways, not just saying sorry.',
    icon: '🔄'
  },
  {
    id: 'yahusha-pharisees',
    category: 'insight',
    fact: 'YAHUSHA rebuked the Pharisees for man-made laws that hid Torah\'s true heart — mercy, justice, faithfulness.',
    icon: '⚖️'
  },
  {
    id: 'ethiopian-preservation',
    category: 'history',
    fact: 'Ancient Ethiopian believers preserved Hebrew texts long before Europe translated them.',
    icon: '🇪🇹'
  },
  {
    id: 'holy-land-righteousness',
    category: 'insight',
    fact: 'The "Holy Land" was meant for righteousness, not tourism.',
    icon: '🏞️'
  },
  {
    id: 'qodesh-set-apart',
    category: 'names',
    fact: 'YAHUAH calls His people Qodesh (Set-Apart) — not religious.',
    icon: '✨'
  },
  {
    id: 'aleph-tav',
    category: 'insight',
    fact: 'Hebrew begins with Aleph and ends with Tav — the same letters YAHUSHA used to describe Himself.',
    icon: '🔤'
  },
  {
    id: 'feasts-foreshadow',
    category: 'insight',
    fact: 'Each Feast of YAHUAH foreshadows YAHUSHA\'s mission — Passover (sacrifice), Unleavened Bread (sinless life), Firstfruits (resurrection), Shavuot (Spirit).',
    icon: '🎭'
  },
  {
    id: 'tzitziyot-fringes',
    category: 'insight',
    fact: 'YAHUAH commanded tzitziyot (fringes) to remind His people of obedience (Numbers 15:38).',
    icon: '🧵'
  },
  {
    id: 'lunar-calendar',
    category: 'history',
    fact: 'Israel followed a lunar calendar, not Rome\'s solar one.',
    icon: '🌙'
  },
  {
    id: 'israelite-bloodline',
    category: 'insight',
    fact: 'Israelite is a bloodline and covenant, not a denomination.',
    icon: '🩸'
  },
  {
    id: 'ruach-understanding',
    category: 'insight',
    fact: 'The RUACH gives understanding — truth over emotion.',
    icon: '💡'
  },
  {
    id: 'ten-commandments-eternal',
    category: 'insight',
    fact: 'The Ten Commandments are ten eternal principles, not ten suggestions.',
    icon: '📜'
  },
  {
    id: 'veil-torn',
    category: 'insight',
    fact: 'When the temple veil tore, it meant access, not abolishment of obedience.',
    icon: '⛪'
  },
  {
    id: 'hebrew-culture',
    category: 'history',
    fact: 'Hebrew culture was rooted in family, covenant, and community, not religion.',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'mark-obedience',
    category: 'insight',
    fact: 'The real mark of YAHUAH is obedience, not technology.',
    icon: '✅'
  },
  {
    id: 'mount-tsiyon',
    category: 'insight',
    fact: 'YAHUSHA will reign from Mount Tsiyon (Zion) — not Rome or Washington.',
    icon: '⛰️'
  },
  {
    id: 'speaking-name',
    category: 'insight',
    fact: 'Speaking the Name YAHUAH connects you with every prophet, psalmist, and righteous soul who ever walked this earth.',
    icon: '🗣️'
  },
  {
    id: 'hebrew-crossed-over',
    category: 'translation',
    fact: 'The word "Hebrew" (Ivri) means "one who crossed over" — symbolizing leaving the world\'s system to walk in YAHUAH\'s covenant.',
    icon: '🌊'
  },
  {
    id: 'first-hebrew',
    category: 'history',
    fact: 'The first person called a Hebrew was Abram (Abraham), after he crossed the river into obedience. (Genesis 14:13)',
    icon: '🚶'
  },
  {
    id: 'adam-red-earth',
    category: 'translation',
    fact: 'The name "Adam" in Hebrew means "red earth" — hinting at the rich, melanated tone of the first man.',
    icon: '🌍'
  },
  {
    id: 'eve-chawwah',
    category: 'names',
    fact: 'Eve\'s original Hebrew name is Chawwah (חוה), meaning "life giver."',
    icon: '💝'
  },
  {
    id: 'serpent-nachash',
    category: 'translation',
    fact: 'The serpent in Eden didn\'t appear as a snake — the Hebrew word "nachash" means "shining one" or "enchanter."',
    icon: '✨'
  },
  {
    id: 'cain-abel-offering',
    category: 'insight',
    fact: 'Cain and Abel\'s offering story is about obedience over effort — one gave what he wanted, the other what YAHUAH required.',
    icon: '🔥'
  },
  {
    id: 'noah-ark-salvation',
    category: 'insight',
    fact: 'Noah\'s Ark wasn\'t just a boat — it was a prophetic symbol of salvation through obedience.',
    icon: '⛵'
  },
  {
    id: 'rainbow-covenant',
    category: 'insight',
    fact: 'The rainbow is YAHUAH\'s covenant sign, not a modern identity flag.',
    icon: '🌈'
  },
  {
    id: 'babel-authority',
    category: 'insight',
    fact: 'Tower of Babel wasn\'t about height — it was about humans trying to reach the heavens without YAHUAH\'s authority.',
    icon: '🗼'
  },
  {
    id: 'abraham-faith-first',
    category: 'insight',
    fact: 'Abraham\'s covenant was sealed before circumcision — faith came first, then obedience followed. (Genesis 15–17)',
    icon: '✡️'
  },
  {
    id: 'promised-land-extent',
    category: 'history',
    fact: 'The land promised to Abraham stretched far beyond modern Israel — from the Nile to the Euphrates.',
    icon: '🗺️'
  },
  {
    id: 'jacob-yisrael',
    category: 'names',
    fact: 'Jacob\'s name was changed to Yisra\'el after wrestling with an angel — meaning "one who prevails with Elohim."',
    icon: '🤼'
  },
  {
    id: 'exodus-wealth',
    category: 'history',
    fact: 'The Israelites left Egypt with gold, silver, and livestock — YAHUAH made sure they didn\'t leave empty-handed.',
    icon: '💰'
  },
  {
    id: 'moses-drawn-out',
    category: 'names',
    fact: 'Moses\' name means "drawn out" — prophetic of YAHUSHA drawing us out from sin and slavery.',
    icon: '🌊'
  },
  {
    id: 'plagues-judgment',
    category: 'insight',
    fact: 'The Ten Plagues were direct judgments against Egypt\'s false gods — each one dismantled a different idol.',
    icon: '⚡'
  },
  {
    id: 'passover-protection',
    category: 'translation',
    fact: 'Passover (Pesach) means "to protect or pass over" — it\'s a story of covering under covenant blood.',
    icon: '🩸'
  },
  {
    id: 'red-sea-location',
    category: 'history',
    fact: 'The Red Sea crossing happened near the Gulf of Aqaba, not the Suez — evidence still sits under the waters.',
    icon: '🌊'
  },
  {
    id: 'manna-what-is-it',
    category: 'translation',
    fact: 'Manna literally means "What is it?" — YAHUAH fed Israel daily with supernatural provision.',
    icon: '🍞'
  },
  {
    id: 'cloud-fire-presence',
    category: 'insight',
    fact: 'YAHUAH\'s cloud by day and fire by night were physical manifestations of His presence — not just symbols.',
    icon: '☁️'
  },
  {
    id: 'tabernacle-throne',
    category: 'insight',
    fact: 'The Tabernacle was a portable throne room — a pattern of heavenly order shown to Moses on the mountain.',
    icon: '⛺'
  },
  {
    id: 'ark-contents',
    category: 'insight',
    fact: 'The Ark of the Covenant contained the Tablets, Aaron\'s Rod, and Manna — Law, Leadership, and Provision.',
    icon: '📦'
  },
  {
    id: 'yom-kippur-entry',
    category: 'history',
    fact: 'The High Priest entered the Most Qodesh Place only once a year — on Yom Kippur (Day of Atonement).',
    icon: '🕊️'
  },
  {
    id: 'shofar-warfare',
    category: 'insight',
    fact: 'The shofar (ram\'s horn) represents spiritual warfare — when blown, it releases divine alert and breakthrough.',
    icon: '🎺'
  },
  {
    id: 'levites-portion',
    category: 'insight',
    fact: 'The Levites had no land inheritance — YAHUAH Himself was their portion. (Numbers 18:20)',
    icon: '👨‍⚖️'
  },
  {
    id: 'david-three-anointings',
    category: 'history',
    fact: 'David was anointed three times — once privately, once publicly, once as king over all Israel.',
    icon: '👑'
  },
  {
    id: 'solomon-wisdom-loyalty',
    category: 'insight',
    fact: 'Solomon\'s wisdom came through YAHUAH\'s Spirit — but his downfall came from divided loyalty.',
    icon: '💔'
  },
  {
    id: 'psalms-worship-album',
    category: 'insight',
    fact: 'The Psalms were songs — the first Hebrew worship album written in pain, repentance, and victory.',
    icon: '🎵'
  },
  {
    id: 'proverbs-kingdom-codes',
    category: 'insight',
    fact: 'Proverbs are not mere advice — they are divine codes for kingdom living.',
    icon: '💎'
  },
  {
    id: 'prophets-function',
    category: 'insight',
    fact: 'The prophets didn\'t just predict — they warned, corrected, and called the people back to Torah.',
    icon: '📣'
  },
  {
    id: 'isaiah-name-meaning',
    category: 'names',
    fact: 'Isaiah\'s name means "YAH is salvation" — he prophesied YAHUSHA\'s virgin birth 700 years in advance.',
    icon: '👶'
  },
  {
    id: 'jeremiah-teen-prophet',
    category: 'insight',
    fact: 'Jeremiah was called as a teen — proof that age doesn\'t limit assignment.',
    icon: '👦'
  },
  {
    id: 'ezekiel-visions',
    category: 'insight',
    fact: 'Ezekiel\'s visions describe heavenly technology and spiritual dimensions unseen by man.',
    icon: '👁️'
  },
  {
    id: 'daniel-torah-babylon',
    category: 'insight',
    fact: 'Daniel kept Torah in Babylon — showing we can live set apart even in captivity.',
    icon: '🦁'
  },
  {
    id: 'three-boys-names',
    category: 'names',
    fact: 'The three Hebrew boys\' real names — Hananyah, Mishael, and Azaryahu — all include YAH\'s Name.',
    icon: '🔥'
  },
  {
    id: 'jonah-dove',
    category: 'names',
    fact: 'Jonah\'s name means "dove" — and his story mirrors Israel\'s rebellion and restoration.',
    icon: '🕊️'
  },
  {
    id: 'job-before-moses',
    category: 'history',
    fact: 'Job (Iyov) lived before Moses — proving righteousness existed before written Torah.',
    icon: '📜'
  },
  {
    id: 'gospel-besorah',
    category: 'translation',
    fact: 'The word "gospel" (besorah) means "good news" — the restoration of covenant between YAHUAH and His people.',
    icon: '📰'
  },
  {
    id: 'gospels-prophecy',
    category: 'insight',
    fact: 'Matthew, Mark, Luke, and John weren\'t writing religion — they were recording fulfilled prophecy.',
    icon: '📖'
  },
  {
    id: 'mary-miryam',
    category: 'names',
    fact: 'Mary\'s Hebrew name is Miryam — she was a descendant of David, making YAHUSHA heir to the throne.',
    icon: '👸'
  },
  {
    id: 'john-baptist-bridge',
    category: 'insight',
    fact: 'John the Baptist (Yahuchanon) was the last of the old covenant prophets, bridging Torah and Messiah.',
    icon: '🌉'
  },
  {
    id: 'young-disciples',
    category: 'history',
    fact: 'YAHUSHA\'s disciples were young men, mostly under 25 — this movement started with youth on fire.',
    icon: '🔥'
  },
  {
    id: 'crucifixion-prophecy',
    category: 'insight',
    fact: 'The Romans crucified YAHUSHA under political pressure — but prophecy said He would lay down His life willingly.',
    icon: '✝️'
  },
  {
    id: 'resurrection-witnesses',
    category: 'history',
    fact: 'The resurrection was witnessed by over 500 people — it\'s historical, not myth.',
    icon: '👁️'
  },
  {
    id: 'pentecost-shavuot',
    category: 'translation',
    fact: 'Pentecost is actually Shavuot, a Hebrew feast celebrating both Torah and Spirit being given.',
    icon: '🕊️'
  },
  {
    id: 'paul-shaul-return',
    category: 'insight',
    fact: 'Paul (Sha\'ul) never converted to a new religion — he returned to Torah through the revelation of YAHUSHA.',
    icon: '🔄'
  },
  {
    id: 'new-creation-obedience',
    category: 'insight',
    fact: 'The phrase "new creation" means reborn into obedience — not freedom from law, but freedom from sin.',
    icon: '✨'
  },
  {
    id: 'revelation-hebrew-imagery',
    category: 'insight',
    fact: 'Revelation is packed with Hebrew imagery — lamps, scrolls, beasts, and seals all trace back to Torah.',
    icon: '📜'
  },
  {
    id: 'hundred-forty-four-thousand',
    category: 'insight',
    fact: 'The 144,000 are not random — they\'re sealed from the twelve tribes of Israel, the covenant remnant.',
    icon: '🔢'
  },
  {
    id: 'new-jerusalem-gates',
    category: 'insight',
    fact: 'The New Jerusalem has twelve gates named after the tribes — there is no "Gentile gate."',
    icon: '🚪'
  },
  {
    id: 'every-tongue-confess',
    category: 'insight',
    fact: 'In the end, every tongue will confess the true Name — YAHUAH is EL, and YAHUSHA is King.',
    icon: '👑'
  }
];

/**
 * Get a fact for the current day (rotates daily)
 */
export function getFactOfTheDay(): DidYouKnowFact {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % didYouKnowFacts.length;
  return didYouKnowFacts[index];
}

/**
 * Get a random fact
 */
export function getRandomFact(): DidYouKnowFact {
  const randomIndex = Math.floor(Math.random() * didYouKnowFacts.length);
  return didYouKnowFacts[randomIndex];
}

/**
 * Get facts by category
 */
export function getFactsByCategory(category: DidYouKnowFact['category']): DidYouKnowFact[] {
  return didYouKnowFacts.filter(fact => fact.category === category);
}

/**
 * Get total number of facts
 */
export function getFactCount(): number {
  return didYouKnowFacts.length;
}


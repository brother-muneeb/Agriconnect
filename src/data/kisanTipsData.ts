export interface Step {
  titleRU: string;
  titleEN: string;
  detailRU: string;
  detailEN: string;
}

export interface Article {
  id: number;
  titleRU: string;
  titleEN: string;
  descriptionRU: string;
  descriptionEN: string;
  image: string;
  categoryRU: string;
  categoryEN: string;
  steps: Step[];
}

export interface SeasonalTip {
  id: string;
  monthRU: string;
  monthEN: string;
  punjabiMonth: string;
  englishMonths: string;
  image: string;
  tipsRU: string[];
  tipsEN: string[];
}

export const kisanArticles: Article[] = [
  {
    id: 1,
    titleRU: "Sahi Beej Ka Chunao Kaise Karein",
    titleEN: "How To Choose The Right Seeds",
    descriptionRU: "Achi fasal ke liye sahi beej ka chunao bohat zaroori hai. Janiye kaise karein sahi beej ka chunao apni zameen ke mutabiq.",
    descriptionEN: "Choosing the right seeds is crucial for a good harvest. Learn how to choose the right seeds according to your land.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Beej (Seeds)",
    categoryEN: "Seeds",
    steps: [
      {
        titleRU: "Apni Zameen Ki Mitti Ka Taiyal Karwayein",
        titleEN: "Get Your Soil Tested",
        detailRU: "Mitti ka test karke pata chalein kay konsa beej sahi rahega",
        detailEN: "Test the soil to find out which seed will work best"
      },
      {
        titleRU: "Mausam Kay Mutabiq Beej Chunein",
        titleEN: "Choose Seeds According To Season",
        detailRU: "Garmi mein alag beej aur sardi mein alag beej hota hai",
        detailEN: "Different seeds for summer and different for winter"
      },
      {
        titleRU: "Certified Beej Hi Khareedein",
        titleEN: "Buy Only Certified Seeds",
        detailRU: "Sirf sarkari ya trusted dukaan say beej lein",
        detailEN: "Buy seeds only from government or trusted shops"
      },
      {
        titleRU: "Beej Ki Expiry Date Dekhein",
        titleEN: "Check Seed Expiry Date",
        detailRU: "Purana beej achi paidawar nahi deta",
        detailEN: "Old seeds do not give good yield"
      },
      {
        titleRU: "Pehle Thora Beej Try Karein",
        titleEN: "Try Small Amount First",
        detailRU: "Poori zameen par lagane say pehle chhoti jagah try karein",
        detailEN: "Try on small area before planting on entire field"
      }
    ]
  },
  {
    id: 2,
    titleRU: "Beej Ko Keeron Say Kaise Bachayein",
    titleEN: "How To Protect Seeds From Pests",
    descriptionRU: "Beej lagane se pehle unhe keeron se bachana zaroori hai. Janiye natural tarike se beej ki hifazat kaise karein.",
    descriptionEN: "It is important to protect seeds from pests before planting. Learn how to protect seeds naturally.",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Beej (Seeds)",
    categoryEN: "Seeds",
    steps: [
      {
        titleRU: "Beej Ko Saaf Jagah Rakhein",
        titleEN: "Keep Seeds In Clean Place",
        detailRU: "Ganda mahaul keeron ko attract karta hai",
        detailEN: "Dirty environment attracts pests"
      },
      {
        titleRU: "Neem Ka Tel Lagayein",
        titleEN: "Apply Neem Oil",
        detailRU: "Beej par neem ka tel lagane say keere nahi aate",
        detailEN: "Applying neem oil on seeds keeps pests away"
      },
      {
        titleRU: "Namak Waala Paani Spray Karein",
        titleEN: "Spray Salt Water",
        detailRU: "Halka namak waala paani spray karo beej ke ird gird",
        detailEN: "Spray light salt water around the seeds"
      },
      {
        titleRU: "Sealed Container Mein Rakhein",
        titleEN: "Store In Sealed Container",
        detailRU: "Beej ko band dabbe mein rakhein taake keere na aayein",
        detailEN: "Keep seeds in closed container to prevent pests"
      },
      {
        titleRU: "Regular Check Karte Rahein",
        titleEN: "Check Regularly",
        detailRU: "Har hafte beej ko check karo keeray toh nahi lage",
        detailEN: "Check seeds every week for any pest damage"
      }
    ]
  },
  {
    id: 3,
    titleRU: "Fasal Ko Kitna Pani Dein",
    titleEN: "How Much Water To Give Crops",
    descriptionRU: "Har fasal ko alag miqdar mein pani chahiye hota hai. Janiye apni fasal ke mutabiq pani dene ka sahi tarika.",
    descriptionEN: "Each crop needs a different amount of water. Learn the right way to water according to your crop.",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Pani (Irrigation)",
    categoryEN: "Irrigation",
    steps: [
      {
        titleRU: "Subah Ya Sham Pani Dein",
        titleEN: "Water In Morning Or Evening",
        detailRU: "Dopahar mein pani dene say zyada paani evaporate hota hai",
        detailEN: "Watering at noon causes more water to evaporate"
      },
      {
        titleRU: "Mitti Ko Check Karein",
        titleEN: "Check The Soil",
        detailRU: "Ungli zameen mein daalo agar geeli hai toh pani mat do",
        detailEN: "Put finger in soil if wet then do not water"
      },
      {
        titleRU: "Har Fasal Ka Pani Alag Hai",
        titleEN: "Each Crop Needs Different Water",
        detailRU: "Tamatar ko zyada pani chahiye aur gajar ko kam",
        detailEN: "Tomatoes need more water and carrots need less"
      },
      {
        titleRU: "Drip System Lagayein",
        titleEN: "Install Drip System",
        detailRU: "Drip system say pani ki bachat hoti hai",
        detailEN: "Drip system saves a lot of water"
      },
      {
        titleRU: "Barish Ka Pani Jamah Karein",
        titleEN: "Collect Rainwater",
        detailRU: "Barish ka pani store karke baad mein use karein",
        detailEN: "Store rainwater and use it later"
      }
    ]
  },
  {
    id: 4,
    titleRU: "Drip Irrigation Kya Hai",
    titleEN: "What Is Drip Irrigation",
    descriptionRU: "Drip irrigation se pani ki bachat hoti hai aur fasal bhi achi hoti hai. Janiye kaise lagayein drip irrigation apne khet mein.",
    descriptionEN: "Drip irrigation saves water and improves crop yield. Learn how to install drip irrigation in your field.",
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Pani (Irrigation)",
    categoryEN: "Irrigation",
    steps: [
      {
        titleRU: "Drip Irrigation Ka Matlab",
        titleEN: "What Is Drip Irrigation",
        detailRU: "Seedha jadon tak pani pahunchane ka tarika",
        detailEN: "Method of delivering water directly to roots"
      },
      {
        titleRU: "Iska Faida Kya Hai",
        titleEN: "What Are Its Benefits",
        detailRU: "60% tak pani bachta hai aur fasal bhi achi hoti hai",
        detailEN: "Saves up to 60% water and gives better crop yield"
      },
      {
        titleRU: "Kaise Lagayein",
        titleEN: "How To Install",
        detailRU: "Pipes aur drippers lein hardware store say",
        detailEN: "Get pipes and drippers from hardware store"
      },
      {
        titleRU: "Kitni L\u093e\u0917at Aati Hai",
        titleEN: "What Is The Cost",
        detailRU: "Ek kanal kay liye 15000 say 25000 rupay lagta hai",
        detailEN: "Costs 15000 to 25000 rupees per kanal"
      },
      {
        titleRU: "Sarkari Subsidy",
        titleEN: "Government Subsidy",
        detailRU: "Punjab government drip system par subsidy deti hai",
        detailEN: "Punjab government gives subsidy on drip systems"
      }
    ]
  },
  {
    id: 5,
    titleRU: "Organic Khaad Kaise Banayein",
    titleEN: "How To Make Organic Fertilizer",
    descriptionRU: "Ghar par hi banayein organic khaad aur apni fasal ko natural tarike se ugayein.",
    descriptionEN: "Make organic fertilizer at home and grow your crops naturally.",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Khaad (Fertilizer)",
    categoryEN: "Fertilizer",
    steps: [
      {
        titleRU: "Sabziyoon Kay Chhalke Jama Karein",
        titleEN: "Collect Vegetable Peels",
        detailRU: "Aloo pyaz tamatar ke chhalke alag rakhein",
        detailEN: "Keep peels of potato onion tomato separately"
      },
      {
        titleRU: "Chai Ki Patti Aur Anday Ki Khol",
        titleEN: "Tea Leaves And Egg Shells",
        detailRU: "Yeh sab ek dabbe mein daalte rahein",
        detailEN: "Keep adding all these in a container"
      },
      {
        titleRU: "Paani Chhhirkein",
        titleEN: "Sprinkle Water",
        detailRU: "Thoda paani daal kar geela rakhein dabbe ko",
        detailEN: "Add little water to keep the container moist"
      },
      {
        titleRU: "4 Hafte Intezaar Karein",
        titleEN: "Wait 4 Weeks",
        detailRU: "Is waqt mein yeh sab khaad ban jaata hai",
        detailEN: "During this time everything becomes fertilizer"
      },
      {
        titleRU: "Zameen Mein Milayin",
        titleEN: "Mix In Soil",
        detailRU: "Tayar khaad ko zameen mein milakar fasal lagayein",
        detailEN: "Mix ready fertilizer in soil before planting"
      }
    ]
  },
  {
    id: 6,
    titleRU: "Zameen Ko Fertile Kaise Rakhein",
    titleEN: "How To Keep Soil Fertile",
    descriptionRU: "Achi paidawar ke liye zameen ka fertile hona zaroori hai. Janiye zameen ki sehat kaise banaye rakhein.",
    descriptionEN: "Fertile soil is essential for good yield. Learn how to maintain soil health.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Khaad (Fertilizer)",
    categoryEN: "Fertilizer",
    steps: [
      {
        titleRU: "Har Saal Fasal Badlein",
        titleEN: "Change Crops Every Year",
        detailRU: "Ek jagah baar baar ek hi fasal mat lagayein",
        detailEN: "Do not plant same crop repeatedly in same place"
      },
      {
        titleRU: "Organic Khaad Daalein",
        titleEN: "Add Organic Fertilizer",
        detailRU: "Chemical khaad kam aur organic zyada use karein",
        detailEN: "Use less chemical and more organic fertilizer"
      },
      {
        titleRU: "Zameen Ko Aaraam Dein",
        titleEN: "Give Soil Rest",
        detailRU: "Saal mein ek baar zameen khali chhoren",
        detailEN: "Leave soil empty once a year"
      },
      {
        titleRU: "Mitti Palatein",
        titleEN: "Turn The Soil",
        detailRU: "Tractor say mitti palatnay say hawa milti hai",
        detailEN: "Turning soil with tractor gives it air"
      },
      {
        titleRU: "Pani Ka Nikaas Banayein",
        titleEN: "Make Water Drainage",
        detailRU: "Zameen mein pani rukne na dein",
        detailEN: "Do not let water stagnate in soil"
      }
    ]
  },
  {
    id: 7,
    titleRU: "Fasal Ko Keeron Say Kaise Bachayein",
    titleEN: "How To Protect Crops From Pests",
    descriptionRU: "Keere fasal ko tabah kar sakte hain. Janiye natural tarike se keeron ko kaise door rakhein apni fasal se.",
    descriptionEN: "Pests can destroy crops. Learn how to keep pests away naturally.",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Keeron Say Bachao",
    categoryEN: "Pest Control",
    steps: [
      {
        titleRU: "Fasal Ki Regular Inspection Karein",
        titleEN: "Regularly Inspect Crops",
        detailRU: "Har 3 din mein fasal ko dhyan say dekhein",
        detailEN: "Look carefully at crops every 3 days"
      },
      {
        titleRU: "Infected Paudhay Alag Karein",
        titleEN: "Separate Infected Plants",
        detailRU: "Keeray lagay paudhay foran alag kar dein",
        detailEN: "Immediately separate plants with pest damage"
      },
      {
        titleRU: "Natural Spray Banayein",
        titleEN: "Make Natural Spray",
        detailRU: "Lehsan mirch ka spray ghar par banayein",
        detailEN: "Make garlic chili spray at home"
      },
      {
        titleRU: "Neem Kay Pattay Use Karein",
        titleEN: "Use Neem Leaves",
        detailRU: "Neem ke patte paani mein ubaal kar spray karein",
        detailEN: "Boil neem leaves in water and spray on crops"
      },
      {
        titleRU: "Zaroorat Par Hi Spray Karein",
        titleEN: "Spray Only When Needed",
        detailRU: "Bina zaroorat spray karna fasal ko nuksan deta hai",
        detailEN: "Unnecessary spraying damages the crop"
      }
    ]
  },
  {
    id: 8,
    titleRU: "Natural Spray Kaise Banayein",
    titleEN: "How To Make Natural Spray",
    descriptionRU: "Chemical spray ki bajaye natural spray banayein ghar par. Sasta bhi hai aur fasal ke liye safe bhi.",
    descriptionEN: "Make natural spray at home instead of chemical spray. It's cheap and safe for crops.",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Keeron Say Bachao",
    categoryEN: "Pest Control",
    steps: [
      {
        titleRU: "Lehsan Ki 10 Kaliyaan Lein",
        titleEN: "Take 10 Garlic Cloves",
        detailRU: "Taaza lehsan zyada asar karta hai",
        detailEN: "Fresh garlic is more effective"
      },
      {
        titleRU: "5 Hari Mirchein Lein",
        titleEN: "Take 5 Green Chilies",
        detailRU: "Jitni tez mirch utna zyada asar",
        detailEN: "Hotter chili means stronger effect"
      },
      {
        titleRU: "Paani Mein Ubaalein",
        titleEN: "Boil In Water",
        detailRU: "1 litre paani mein 15 minute ubaalein",
        detailEN: "Boil in 1 litre water for 15 minutes"
      },
      {
        titleRU: "Thanda Karke Chaanein",
        titleEN: "Cool And Strain",
        detailRU: "Kapray say chaan kar saaf karein",
        detailEN: "Strain through cloth to clean"
      },
      {
        titleRU: "Spray Bottle Mein Bharein",
        titleEN: "Fill In Spray Bottle",
        detailRU: "Subah ya sham fasal par spray karein",
        detailEN: "Spray on crops in morning or evening"
      }
    ]
  },
  {
    id: 9,
    titleRU: "Sahi Waqt Par Katai Kaise Karein",
    titleEN: "How To Harvest At Right Time",
    descriptionRU: "Fasal ki katai ka sahi waqt bohat zaroori hai. Janiye kaise pata karein ke fasal katai ke liye tayyar hai.",
    descriptionEN: "The right time for harvesting is very important. Learn how to tell when the crop is ready.",
    image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=800",
    categoryRU: "Fasal Ki Katai",
    categoryEN: "Harvesting",
    steps: [
      {
        titleRU: "Fasal Ka Rang Dekhein",
        titleEN: "Check Color Of Crop",
        detailRU: "Sona rang aane par katai ka waqt hai",
        detailEN: "Golden color means it is time to harvest"
      },
      {
        titleRU: "Daanay Ko Haath Say Check Karein",
        titleEN: "Check Grain By Hand",
        detailRU: "Daana sakht ho toh katai ka waqt hai",
        detailEN: "If grain is hard then it is harvest time"
      },
      {
        titleRU: "Subah Katai Karein",
        titleEN: "Harvest In Morning",
        detailRU: "Subah ki thandak mein katai achi hoti hai",
        detailEN: "Harvesting in morning coolness is better"
      },
      {
        titleRU: "Sahi Auzaar Use Karein",
        titleEN: "Use Proper Tools",
        detailRU: "Tez dhar auzaar say fasal ko nuksan kam hota hai",
        detailEN: "Sharp tools cause less damage to crops"
      },
      {
        titleRU: "Jaldi Store Karein",
        titleEN: "Store Quickly",
        detailRU: "Katai kay baad jaldi store karein warna kharab hogi",
        detailEN: "Store quickly after harvest or it will spoil"
      }
    ]
  },
  {
    id: 10,
    titleRU: "Fasal Ki Storage Kaise Karein",
    titleEN: "How To Store Crops",
    descriptionRU: "Katai ke baad fasal ki sahi storage bohat zaroori hai. Janiye kaise karein fasal ko mahfuz store.",
    descriptionEN: "Proper storage after harvesting is essential. Learn how to store crops safely.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbI_RO5kHwDF9Myf-P6lNYOYX60h7VgOv69LWeBy_O8QNLtZiN2r47lpw&s=10",
    categoryRU: "Fasal Ki Katai",
    categoryEN: "Harvesting",
    steps: [
      {
        titleRU: "Fasal Ko Dhoop Mein Sukhayen",
        titleEN: "Dry Crop In Sunlight",
        detailRU: "Kam az kam 3 din dhoop mein sukhayen",
        detailEN: "Dry in sunlight for at least 3 days"
      },
      {
        titleRU: "Saaf Bartan Mein Rakhein",
        titleEN: "Store In Clean Container",
        detailRU: "Ganda bartan mein rakhne say fasal kharab hoti hai",
        detailEN: "Dirty container spoils the crop"
      },
      {
        titleRU: "Thandi Jagah Rakhein",
        titleEN: "Keep In Cool Place",
        detailRU: "Garmi mein fasal jaldi kharab hoti hai",
        detailEN: "Crop spoils quickly in heat"
      },
      {
        titleRU: "Nam\u012b Say Bachayein",
        titleEN: "Protect From Moisture",
        detailRU: "Geeli jagah rakhne say fungus lagti hai",
        detailEN: "Keeping in wet place causes fungus"
      },
      {
        titleRU: "Regular Check Karte Rahein",
        titleEN: "Check Regularly",
        detailRU: "Har hafte store check karein",
        detailEN: "Check store every week"
      }
    ]
  }
];

export const seasonalTipsData: SeasonalTip[] = [
  {
    id: "chet",
    monthRU: "Chet",
    monthEN: "Chet",
    punjabiMonth: "Chet",
    englishMonths: "March-April",
    image: "https://images.unsplash.com/photo-1495107336039-ec1593ad3366?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Tamatar aur mirch kay beej lagayein",
      "Zameen ko khaad day kar tayyar karein",
      "Pani ki miqdar barha dein",
      "Keeron ka khaas khayal rakhein",
      "Bahar ki fasal ki katai karein"
    ],
    tipsEN: [
      "Plant tomato and chili seeds",
      "Prepare soil by adding fertilizer",
      "Increase water quantity",
      "Take special care of pests",
      "Harvest spring crops"
    ]
  },
  {
    id: "vaisakh",
    monthRU: "Vaisakh",
    monthEN: "Vaisakh",
    punjabiMonth: "Vaisakh",
    englishMonths: "April-May",
    image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Gandum ki katai ka waqt hai",
      "Fasal ko zyada dhoop say bachayein",
      "Subah aur sham pani dein",
      "Naye beej ki tayari karein",
      "Khaad ka baqiya stock check karein"
    ],
    tipsEN: [
      "Time for wheat harvest",
      "Protect crops from excess sunlight",
      "Water in morning and evening",
      "Prepare new seeds",
      "Check remaining fertilizer stock"
    ]
  },
  {
    id: "jeth",
    monthRU: "Jeth",
    monthEN: "Jeth",
    punjabiMonth: "Jeth",
    englishMonths: "May-June",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Garmi bohot zyada hoti hai",
      "Subah 6 baje pani dein",
      "Fasal ko chhaaon dein agar mumkin ho",
      "Pani ki bachat zaroor karein",
      "Sabziyaan jaldi tor lein"
    ],
    tipsEN: [
      "Heat is very intense",
      "Water at 6am in morning",
      "Give shade to crops if possible",
      "Definitely save water",
      "Pick vegetables quickly"
    ]
  },
  {
    id: "harh",
    monthRU: "Harh",
    monthEN: "Harh",
    punjabiMonth: "Harh",
    englishMonths: "June-July",
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Barish shuru hoti hai",
      "Khet mein pani nikalne ka intezam karein",
      "Chawal ki fasal lagayein",
      "Keeron ki tadaad barh jaati hai",
      "Spray ka intezam rakhein"
    ],
    tipsEN: [
      "Rains begin this month",
      "Arrange water drainage in fields",
      "Plant rice crop",
      "Pest numbers increase",
      "Keep spray ready"
    ]
  },
  {
    id: "sawan",
    monthRU: "Sawan",
    monthEN: "Sawan",
    punjabiMonth: "Sawan",
    englishMonths: "July-August",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Chawal ki fasal ka khaas khayal",
      "Barish zyada hone par pani nikalein",
      "Makai ki fasal tayyar hoti hai",
      "Organic khaad daalein",
      "Mitti ki sehat check karein"
    ],
    tipsEN: [
      "Special care for rice crops",
      "Drain water if too much rain",
      "Corn crop becomes ready",
      "Apply organic fertilizer",
      "Check soil health"
    ]
  },
  {
    id: "bhadon",
    monthRU: "Bhadon",
    monthEN: "Bhadon",
    punjabiMonth: "Bhadon",
    englishMonths: "August-September",
    image: "https://images.unsplash.com/photo-1508013861974-9f6347163835?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Barish kam hone lagti hai",
      "Rabi fasal ki tayari shuru karein",
      "Zameen ko aaram dein",
      "Gehun kay beej khareedein",
      "Purani fasal ki baqi katai karein"
    ],
    tipsEN: [
      "Rains start reducing",
      "Start preparing for Rabi crops",
      "Give rest to soil",
      "Buy wheat seeds",
      "Complete remaining harvest"
    ]
  },
  {
    id: "assu",
    monthRU: "Assu",
    monthEN: "Assu",
    punjabiMonth: "Assu",
    englishMonths: "September-October",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Mausam khushgawar hota hai",
      "Gehun lagane ki tayari karein",
      "Zameen mein khaad milayen",
      "Sabziyaan lagane ka acha waqt",
      "Pani ki miqdar kam karein"
    ],
    tipsEN: [
      "Weather becomes pleasant",
      "Prepare to plant wheat",
      "Mix fertilizer in soil",
      "Good time to plant vegetables",
      "Reduce water quantity"
    ]
  },
  {
    id: "katak",
    monthRU: "Katak",
    monthEN: "Katak",
    punjabiMonth: "Katak",
    englishMonths: "October-November",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Gehun lagane ka sahi waqt",
      "Raat thandi hone lagti hai",
      "Fasal ko pala say bachane ki tayari",
      "Jau aur chana bhi lagayein",
      "Pani subah dein sham ko nahi"
    ],
    tipsEN: [
      "Right time to plant wheat",
      "Nights start getting cold",
      "Prepare to protect crops from frost",
      "Also plant barley and chickpeas",
      "Water in morning not evening"
    ]
  },
  {
    id: "maghar",
    monthRU: "Maghar",
    monthEN: "Maghar",
    punjabiMonth: "Maghar",
    englishMonths: "November-December",
    image: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Sardi shuru hoti hai",
      "Fasal ko raat mein dhakein",
      "Pani ki miqdar aur kam karein",
      "Gajar mooli shalgam lagayein",
      "Khaad ka istemal band karein"
    ],
    tipsEN: [
      "Winter begins",
      "Cover crops at night",
      "Further reduce water quantity",
      "Plant carrot radish turnip",
      "Stop using fertilizer"
    ]
  },
  {
    id: "poh",
    monthRU: "Poh",
    monthEN: "Poh",
    punjabiMonth: "Poh",
    englishMonths: "December-January",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Sardi bohot zyada hoti hai",
      "Pala parne ka khatra hai",
      "Raat ko fasal zaroor dhakein",
      "Subah dhoop nikalnay par pani dein",
      "Naye beej mat lagayein"
    ],
    tipsEN: [
      "Very intense cold",
      "Risk of frost",
      "Definitely cover crops at night",
      "Water after morning sun comes out",
      "Do not plant new seeds"
    ]
  },
  {
    id: "magh",
    monthRU: "Magh",
    monthEN: "Magh",
    punjabiMonth: "Magh",
    englishMonths: "January-February",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Sardi dheere dheere kam hoti hai",
      "Bahar ki fasal ki tayari karein",
      "Beej ka stock check karein",
      "Zameen ki khudai karein",
      "Khaad ka intezam karein"
    ],
    tipsEN: [
      "Cold slowly reduces",
      "Prepare for spring crops",
      "Check seed stock",
      "Dig and prepare soil",
      "Arrange fertilizer"
    ]
  },
  {
    id: "phagun",
    monthRU: "Phagun",
    monthEN: "Phagun",
    punjabiMonth: "Phagun",
    englishMonths: "February-March",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800",
    tipsRU: [
      "Bahar aa rahi hai",
      "Tamatar mirch kay beej lagayein",
      "Pani dheere dheere barhayen",
      "Keeron ka nazar rakhein",
      "Zameen tayyar karein agle season kay liye"
    ],
    tipsEN: [
      "Spring is arriving",
      "Plant tomato and chili seeds",
      "Gradually increase watering",
      "Keep watch on pests",
      "Prepare soil for next season"
    ]
  }
];

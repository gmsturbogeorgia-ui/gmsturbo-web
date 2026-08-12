export type Lang = "EN" | "KA";

// Nested UI copy dictionary.
//
// Casing note: this file used to store almost every string SHOUTED IN CAPS,
// with "/ 01 — " prefixes on section labels and "›" / "‹" glued onto link
// text. All three are gone. Caps belongs to the stylesheet (text-transform),
// not the content layer, and the arrows are now drawn by the ArrowLink
// component — baking them into strings meant they couldn't animate and they
// leaked into screen-reader output.
//
// Product names, part codes, vehicle makes and unit-bearing spec values
// (PSI, HP, A/R) stay untranslated — standard practice for bilingual
// automotive-parts catalogs, and it keeps SKUs unambiguous in both languages.
export const dict = {
  EN: {
    common: {
      viewDetail: "View detail",
    },
    nav: {
      inventory: "Inventory",
      services: "Services",
      showroom: "Showroom",
      garage: "Garage",
      contact: "Contact",
      bookCall: "Book a call",
    },
    footer: {
      blurb:
        "Turbocharger sales, diagnostics, repair and performance engineering — built in Tbilisi since 2014.",
      navigation: "Navigation",
      inventory: "Inventory",
      services: "Services",
      showroom: "Showroom",
      contact: "Contact",
      connect: "Connect",
      precisionTag: "Industrial precision",
      builtIn: "Built in Tbilisi",
    },
    home: {
      heroKicker: "Turbocharger engineering · Tbilisi, est. 2014",
      heroLine1: "Give your",
      heroLine2: "engine a",
      heroLine3a: "second",
      heroLine3b: "life.",
      heroCta1: "Browse the catalog",
      heroCta2: "Our services",
      heroBlurb:
        "Sales, diagnostics, rebuilds and performance turbos — specced, balanced and bench-tested by the engineers who assemble them.",
      heroLiveTag: "Live from the workshop",
      heroPhotoCaption: "Bench-tested before it ships",
      inventoryTitle: "Built and ready to ship",
      inventoryLead:
        "A working selection from the floor. Every unit is balanced, pressure-tested and sealed before it leaves the bench.",
      inventoryViewAll: "View all products",
      precisionKicker: "The craft",
      precisionTitle1: "Precision",
      precisionTitle2: "rebuilding",
      precisionBlurb:
        "Every turbo that passes our bench is fully disassembled, ultrasonically cleaned, balanced to sub-micron tolerances and pressure-tested before delivery. We don't ship anything we wouldn't run in our own car.",
      precisionQuote:
        "The difference between a rebuild and a real rebuild is the obsession that goes into it. GMS is the only shop in the Caucasus I trust.",
      precisionQuoteAuthor: "Daviti K. — time attack driver",
      statBalance: "Balance tolerance",
      statTurnaround: "Average turnaround",
      statRebuilt: "Units rebuilt",
      statTested: "Bench tested",
      journeyKicker: "The process",
      journeyTitle: "From fault scan to sealed delivery",
      journeyLead:
        "Six stages, one bench, the same engineers throughout. You get a signed report at every hand-off.",
      workshopTag: "Inside the workshop",
      workshopTitle: "A garage built for engineers, not salesmen.",
      workshopBlurb:
        "CNC machining, VSR balancing rigs, ultrasonic cleaning lines and full flow-bench testing — under one roof in central Tbilisi.",
      scheduleVisit: "Schedule a visit",
      ctaTitle1: "Ready to",
      ctaTitle2: "upgrade?",
      ctaBlurb:
        "Talk to our technical team, or visit the shop in central Tbilisi to spec your build.",
      callDirect: "Call direct",
      workshop: "Workshop",
      location: "Tbilisi, Georgia",
      heroCtaCatalog: "Browse the catalog",
      factEst: "Established",
      factEstVal: "2014",
      factRebuilt: "Units rebuilt",
      factRebuiltVal: "1,400+",
      factTurnaround: "Average turnaround",
      factTurnaroundVal: "24h",
      factWarranty: "Warranty",
      factWarrantyVal: "24 mo",
      bookKicker: "Talk to an engineer",
      bookTitle1: "Ready to",
      bookTitle2: "spec your build?",
      bookBlurb:
        "Book a call with our technical team, or reach us directly — we'll confirm fitment, lead time and price, usually within one business day.",
    },
    booking: {
      cta: "Book a call",
      kicker: "Request a callback",
      title: "Book a call",
      blurb:
        "Leave your details and what you're building. Our technical team will call you back to confirm fitment, timing and price — no obligation.",
      name: "Full name",
      phone: "Phone",
      email: "Email",
      topic: "Topic",
      topicGeneral: "General enquiry",
      topicRebuild: "Rebuild / repair",
      topicHybrid: "Hybrid upgrade",
      topicCompetition: "Competition build",
      topicViewing: "Showroom viewing",
      preferred: "Preferred time",
      preferredPlaceholder: "e.g. Weekdays after 17:00",
      message: "Message",
      messagePlaceholder: "Vehicle, target power, anything we should know…",
      submit: "Request callback",
      privacy:
        "We'll only use your details to contact you about this request.",
      close: "Close",
      successKicker: "Request received",
      successTitle: "We'll be in touch",
      successBody:
        "Thanks — your callback request is in. Our team will reach out shortly during workshop hours.",
      done: "Done",
    },
    contact: {
      tag: "Tsereteli Ave 114, Tbilisi",
      title1: "Contact us",
      title2: "or book a callback",
      blurb:
        "Call, message or visit the workshop. For a spec consultation or a rebuild quote, book a callback and our engineers will reach out.",
      reachKicker: "Reach us",
      phoneLabel: "Phone",
      emailLabel: "Email",
      addressLabel: "Address",
      hoursLabel: "Hours",
      hoursVal: "Mon–Fri · 10:00–20:00",
      saturdayLabel: "Saturday",
      saturdayVal: "11:00–18:00",
      bookKicker: "Talk to us",
      bookTitle1: "Prefer we",
      bookTitle2: "call you?",
      bookBlurb:
        "Leave your number and what you're building. Our technical team will call you back during workshop hours to spec your build.",
      findKicker: "Find us",
      findTitle: "The workshop",
    },
    catalog: {
      titleLine1: "Forged for",
      titleLine2: "boost",
      blurb:
        "Filter by vehicle platform and category. Every unit is bench-tested and shipped sealed.",
      searchPlaceholder: "Search by name, code, vehicle, fitment or spec…",
      filters: "Filters",
      category: "Category",
      vehicle: "Vehicle",
      sort: "Sort",
      sortFeatured: "Featured",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      sortBoost: "Boost: high to low",
      active: "Active",
      clearAll: "Clear all",
      allOption: "All",
      showResults: "Show results",
      noResultsKicker: "Search diagnostics",
      noResultsTitle: "No matching units",
      noResultsBlurbLead: "Your search for",
      noResultsBlurbTail: "didn't return anything in our active database.",
      resetFilter: "Reset filters",
      requestCustomSpec: "Request a custom spec",
      browseCore: "Browse core calibrations",
      popularPlatforms: "Popular platforms",
      customBuilds: "Custom builds",
      cantFind1: "Can't find your",
      cantFind2: "fitment?",
      customBlurb:
        "Send us your platform, target power and fuel — we'll spec the exact housing, wheel set and CHRA for your build.",
      requestQuote: "Request a quote",
      fits: "Fits",
      platforms: "platforms",
      unitsSuffix: "units",
      viewAll: "View all",
    },
    product: {
      priceFrom: "Price from",
      requestQuote: "Request a quote",
      callWorkshop: "Call the workshop",
      maxBoost: "Max boost",
      hpPotential: "HP potential",
      warranty: "Warranty",
      specsKicker: "Technical data",
      specsTitle: "Specifications",
      parameters: "parameters",
      compatKicker: "Vehicle compatibility",
      compatTitle: "Confirmed fitments",
      compatBlurb:
        "Verified against OEM service data. Contact our team for unlisted platforms — most engines can be adapted with the correct manifold and downpipe.",
      fitmentTag: "Fitment",
      years: "Years",
      engine: "Engine",
      quoteKicker: "Request a quote",
      quoteTitle1: "Spec your",
      quoteTitle2: "build",
      quoteBlurb:
        "Tell us your vehicle, target power and fuel. Our technical team will confirm fitment, lead time and the final price tailored to your build — usually within one business day.",
      unit: "Unit",
      listPrice: "List price",
      stock: "Stock",
      leadTime: "Lead time",
      leadMade: "3–4 weeks",
      leadReady: "2–5 days",
      fullName: "Full name",
      phone: "Phone",
      email: "Email",
      vehicleField: "Vehicle (make / model / year)",
      targetPower: "Target power (HP)",
      fuel: "Fuel",
      fuelPlaceholder: "98 / E85 / Diesel",
      notes: "Notes",
      notesPlaceholder: "Supporting mods, timeline, anything we should know…",
      sendRequest: "Send request",
      requestSent: "Request sent — we'll be in touch",
      relatedKicker: "Same category",
      relatedTitle: "You may also consider",
      notFoundTitle: "Product not found",
      notFoundBlurb:
        "The unit you're looking for isn't in our catalog. It may have been retired or renamed.",
      backToCatalog: "Back to catalog",
      home: "Home",
      catalog: "Catalog",
    },
    services: {
      kicker: "In-house engineering",
      title1: "Every turbo",
      title2: "earns",
      title2b: "its",
      title3: "pressure.",
      blurb:
        "Six dedicated workflows — from a 60-minute fault scan to a two-week competition build — performed by the same engineers, on the same bench, under the same obsession. No outsourcing. No shortcuts.",
      unitsRebuilt: "Units rebuilt",
      mmTolerance: "mm tolerance",
      avgTurnaround: "Average turnaround",
      catalogKicker: "Catalog",
      matrixTitle: "Service matrix",
      requestQuote: "Request a quote",
      eta: "ETA",
      starting: "Starting",
      methodKicker: "Method",
      method1: "Measured.",
      method2: "Machined.",
      method3: "Mounted.",
      methodBlurb:
        "Every job follows the same documented protocol. You receive a signed inspection report, a balancing certificate and a sealed final-test record with every unit.",
      scheduleVisit: "Schedule a visit",
      warranty1t: "24-month warranty",
      warranty1d:
        "Every rebuilt unit ships with a 24-month workmanship warranty against premature failure.",
      warranty2t: "Documented",
      warranty2d:
        "Inspection, balancing and final-test reports archived under your build ID for life.",
      warranty3t: "Caucasus-wide",
      warranty3d:
        "Sealed delivery to anywhere in Georgia, Armenia and Azerbaijan within 48 hours.",
    },
    showroom: {
      tag: "Flagship · Tsereteli Ave 114, Tbilisi",
      title1: "The",
      title2: "showroom",
      hoursLabel: "Hours",
      hoursVal: "Mon–Fri · 10:00–20:00",
      saturdayLabel: "Saturday",
      saturdayVal: "11:00–18:00",
      viewingsLabel: "Viewings",
      viewingsVal: "By appointment",
      testFitLabel: "Test fit",
      testFitVal: "On-site",
      spaceKicker: "The space",
      spaceTitle1: "A room for the",
      spaceTitle2: "obsessed.",
      p1: "Inside an unmarked industrial unit on Tsereteli Avenue, the GMS flagship is half gallery, half engineering bench. Every turbocharger on display is a working unit — dyno-correlated, signed and ready to ship.",
      p2: "The space was built for the people who walk in already knowing what an A/R ratio is. Sit at the bar, watch a CHRA being balanced through the glass wall, and spec your next build alongside the engineer who'll assemble it.",
      bookViewing: "Book a private viewing",
      galleryKicker: "Gallery",
      galleryTitle: "Inside the flagship",
      galleryLead:
        "Photographed on an ordinary Tuesday — no staging, no rendered shelves.",
      displayKicker: "On display",
      collectionTitle: "The collection",
      fullCatalog: "Full catalog",
      plinth: "Plinth",
      visitKicker: "Visit",
      visit1: "Walk in.",
      visit2: "Spec out.",
      visitBlurb:
        "No appointment required for browsing. For private viewings, test fits or competition consultations, reserve an hour with our lead engineer.",
      addressLabel: "Address",
      callLabel: "Call",
      emailLabel: "Email",
    },
  },
  KA: {
    common: {
      viewDetail: "დეტალურად ნახვა",
    },
    nav: {
      inventory: "ინვენტარი",
      services: "სერვისები",
      showroom: "სავიტრინო დარბაზი",
      garage: "სახელოსნო",
      contact: "კონტაქტი",
      bookCall: "დაჯავშნე ზარი",
    },
    footer: {
      blurb:
        "ტურბოკომპრესორების გაყიდვა, დიაგნოსტიკა, რემონტი და წარმადობის ინჟინერია — შექმნილია თბილისში 2014 წლიდან.",
      navigation: "ნავიგაცია",
      inventory: "ინვენტარი",
      services: "სერვისები",
      showroom: "სავიტრინო დარბაზი",
      contact: "კონტაქტი",
      connect: "გამოგვყევით",
      precisionTag: "ინდუსტრიული სიზუსტე",
      builtIn: "დამზადებულია თბილისში",
    },
    home: {
      heroKicker: "ტურბოკომპრესორების ინჟინერია · თბილისი, 2014 წლიდან",
      heroLine1: "აჩუქე შენს",
      heroLine2: "ძრავას",
      heroLine3a: "მეორე",
      heroLine3b: "სიცოცხლე.",
      heroCta1: "კატალოგის დათვალიერება",
      heroCta2: "ჩვენი სერვისები",
      heroBlurb:
        "გაყიდვა, დიაგნოსტიკა, აღდგენა და წარმადობის ტურბოები — შერჩეული, დაბალანსებული და სტენდზე ტესტირებული იმავე ინჟინრების მიერ, ვინც მათ აწყობს.",
      heroLiveTag: "პირდაპირ სახელოსნოდან",
      heroPhotoCaption: "სტენდზე ტესტირებული გაგზავნამდე",
      inventoryTitle: "აწყობილი და გასაგზავნად მზადაა",
      inventoryLead:
        "შერჩევა სამუშაო დარბაზიდან. ყოველი ერთეული დაბალანსებულია, წნევაზე შემოწმებული და დალუქული სტენდიდან გასვლამდე.",
      inventoryViewAll: "ყველა პროდუქტის ნახვა",
      precisionKicker: "ხელოსნობა",
      precisionTitle1: "სიზუსტით",
      precisionTitle2: "აღდგენა",
      precisionBlurb:
        "ყოველი ტურბო, რომელიც ჩვენს სტენდზე გადის, სრულად იშლება, ულტრაბგერით სუფთავდება, მიკრონის სიზუსტით ბალანსდება და წნევაზე მოწმდება მიწოდებამდე. არასდროს ვგზავნით იმას, რასაც საკუთარ მანქანაში არ დავდგამდით.",
      precisionQuote:
        "განსხვავება უბრალო აღდგენასა და ნამდვილ აღდგენას შორის არის გატაცება, რაც მასშია ჩადებული. GMS არის ერთადერთი სახელოსნო კავკასიაში, რომელსაც ვენდობი.",
      precisionQuoteAuthor: "დავითი კ. — თაიმ-ატაკის მძღოლი",
      statBalance: "ბალანსის სიზუსტე",
      statTurnaround: "საშუალო ვადა",
      statRebuilt: "აღდგენილი ერთეული",
      statTested: "სტენდზე ტესტირებული",
      journeyKicker: "პროცესი",
      journeyTitle: "ხარვეზების სკანირებიდან დალუქულ მიწოდებამდე",
      journeyLead:
        "ექვსი ეტაპი, ერთი სტენდი, იგივე ინჟინრები ბოლომდე. ყოველ ეტაპზე იღებთ ხელმოწერილ ანგარიშს.",
      workshopTag: "სახელოსნოს შიგნით",
      workshopTitle: "გარაჟი აშენებულია ინჟინრებისთვის, არა გამყიდველებისთვის.",
      workshopBlurb:
        "CNC დამუშავება, VSR საბალანსო სტენდები, ულტრაბგერითი გაწმენდის ხაზები და სრული ნაკადის სტენდზე ტესტირება — ერთი სახურავის ქვეშ, თბილისის ცენტრში.",
      scheduleVisit: "ვიზიტის დაგეგმვა",
      ctaTitle1: "მზად ხარ",
      ctaTitle2: "განახლებისთვის?",
      ctaBlurb:
        "დაუკავშირდით ჩვენს ტექნიკურ გუნდს ან ეწვიეთ სახელოსნოს თბილისის ცენტრში თქვენი პროექტის დასაზუსტებლად.",
      callDirect: "პირდაპირი ზარი",
      workshop: "სახელოსნო",
      location: "თბილისი, საქართველო",
      heroCtaCatalog: "კატალოგის დათვალიერება",
      factEst: "დაარსდა",
      factEstVal: "2014",
      factRebuilt: "აღდგენილი ერთეული",
      factRebuiltVal: "1,400+",
      factTurnaround: "საშუალო ვადა",
      factTurnaroundVal: "24 სთ",
      factWarranty: "გარანტია",
      factWarrantyVal: "24 თვე",
      bookKicker: "ესაუბრე ინჟინერს",
      bookTitle1: "მზად ხარ",
      bookTitle2: "პროექტის დასაზუსტებლად?",
      bookBlurb:
        "დაჯავშნეთ ზარი ჩვენს ტექნიკურ გუნდთან ან პირდაპირ დაგვიკავშირდით — დავადასტურებთ თავსებადობას, ვადებსა და ფასს, ჩვეულებრივ ერთ სამუშაო დღეში.",
    },
    booking: {
      cta: "დაჯავშნე ზარი",
      kicker: "გადმოგირეკავთ",
      title: "დაჯავშნე ზარი",
      blurb:
        "დატოვეთ თქვენი მონაცემები და რას აწყობთ. ჩვენი ტექნიკური გუნდი დაგირეკავთ თავსებადობის, ვადებისა და ფასის დასაზუსტებლად — ვალდებულების გარეშე.",
      name: "სრული სახელი",
      phone: "ტელეფონი",
      email: "ელფოსტა",
      topic: "თემა",
      topicGeneral: "ზოგადი კითხვა",
      topicRebuild: "აღდგენა / რემონტი",
      topicHybrid: "ჰიბრიდული განახლება",
      topicCompetition: "სპორტული პროექტი",
      topicViewing: "დარბაზის დათვალიერება",
      preferred: "სასურველი დრო",
      preferredPlaceholder: "მაგ. სამუშაო დღეებში 17:00-ის შემდეგ",
      message: "შეტყობინება",
      messagePlaceholder:
        "ავტომობილი, სამიზნე სიმძლავრე, ყველაფერი რაც უნდა ვიცოდეთ…",
      submit: "გამოძახების მოთხოვნა",
      privacy:
        "თქვენს მონაცემებს გამოვიყენებთ მხოლოდ ამ მოთხოვნაზე დასაკავშირებლად.",
      close: "დახურვა",
      successKicker: "მოთხოვნა მიღებულია",
      successTitle: "მალე დაგიკავშირდებით",
      successBody:
        "გმადლობთ — თქვენი გამოძახების მოთხოვნა მიღებულია. ჩვენი გუნდი მალე დაგიკავშირდებათ სამუშაო საათებში.",
      done: "მზადაა",
    },
    contact: {
      tag: "წერეთლის გამზ. 114, თბილისი",
      title1: "დაგვიკავშირდით",
      title2: "ან დაჯავშნეთ ზარი",
      blurb:
        "დაგვირეკეთ, მოგვწერეთ ან ეწვიეთ სახელოსნოს. კონსულტაციის ან აღდგენის ფასის მისაღებად დაჯავშნეთ გამოძახება და ჩვენი ინჟინრები დაგიკავშირდებიან.",
      reachKicker: "დაგვიკავშირდით",
      phoneLabel: "ტელეფონი",
      emailLabel: "ელფოსტა",
      addressLabel: "მისამართი",
      hoursLabel: "სამუშაო საათები",
      hoursVal: "ორშ–პარ · 10:00–20:00",
      saturdayLabel: "შაბათი",
      saturdayVal: "11:00–18:00",
      bookKicker: "მოგვწერეთ",
      bookTitle1: "გირჩევნიათ",
      bookTitle2: "ჩვენ დაგირეკოთ?",
      bookBlurb:
        "დატოვეთ თქვენი ნომერი და რას აწყობთ. ჩვენი ტექნიკური გუნდი დაგირეკავთ სამუშაო საათებში პროექტის დასაზუსტებლად.",
      findKicker: "მოგვძებნეთ",
      findTitle: "სახელოსნო",
    },
    catalog: {
      titleLine1: "შექმნილია",
      titleLine2: "დატენვისთვის",
      blurb:
        "გაფილტრეთ ავტომობილის პლატფორმისა და კატეგორიის მიხედვით. ყოველი ერთეული სტენდზეა ტესტირებული და დალუქული იგზავნება.",
      searchPlaceholder:
        "მოძებნეთ სახელით, კოდით, ავტომობილით ან სპეციფიკაციით…",
      filters: "ფილტრები",
      category: "კატეგორია",
      vehicle: "ავტომობილი",
      sort: "დალაგება",
      sortFeatured: "გამორჩეული",
      sortPriceAsc: "ფასი: დაბლიდან მაღლისკენ",
      sortPriceDesc: "ფასი: მაღლიდან დაბლისკენ",
      sortBoost: "დატენვა: მაღლიდან დაბლისკენ",
      active: "აქტიური",
      clearAll: "ყველას გასუფთავება",
      allOption: "ყველა",
      showResults: "შედეგების ნახვა",
      noResultsKicker: "ძიების დიაგნოსტიკა",
      noResultsTitle: "შესაბამისი ერთეული ვერ მოიძებნა",
      noResultsBlurbLead: "თქვენი ძიება",
      noResultsBlurbTail: "ვერაფერს პოულობს ჩვენს აქტიურ ბაზაში.",
      resetFilter: "ფილტრების გასუფთავება",
      requestCustomSpec: "ინდივიდუალური სპეციფიკაციის მოთხოვნა",
      browseCore: "მთავარი კატეგორიების დათვალიერება",
      popularPlatforms: "პოპულარული პლატფორმები",
      customBuilds: "ინდივიდუალური პროექტები",
      cantFind1: "ვერ პოულობთ თქვენს",
      cantFind2: "მორგებას?",
      customBlurb:
        "გამოგვიგზავნეთ თქვენი პლატფორმა, სამიზნე სიმძლავრე და საწვავის ტიპი — ჩვენ შევარჩევთ ზუსტ კორპუსს, ბორბლების ნაკრებსა და CHRA-ს თქვენი პროექტისთვის.",
      requestQuote: "ფასის მოთხოვნა",
      fits: "თავსებადობა",
      platforms: "პლატფორმა",
      unitsSuffix: "ერთეული",
      viewAll: "ყველას ნახვა",
    },
    product: {
      priceFrom: "ფასი დან",
      requestQuote: "ფასის მოთხოვნა",
      callWorkshop: "დარეკვა სახელოსნოში",
      maxBoost: "მაქს. ბუსტი",
      hpPotential: "ცხ.ძ. პოტენციალი",
      warranty: "გარანტია",
      specsKicker: "ტექნიკური მონაცემები",
      specsTitle: "სპეციფიკაციები",
      parameters: "პარამეტრი",
      compatKicker: "ავტომობილთან თავსებადობა",
      compatTitle: "დადასტურებული თავსებადობა",
      compatBlurb:
        "დადასტურებულია OEM სერვის მონაცემებით. დაუკავშირდით ჩვენს გუნდს ჩამონათვალში არარსებული პლატფორმებისთვის — ძრავების უმეტესობის ადაპტირება შესაძლებელია სწორი კოლექტორითა და დაუნპაიპით.",
      fitmentTag: "თავსებადობა",
      years: "წლები",
      engine: "ძრავი",
      quoteKicker: "ფასის მოთხოვნა",
      quoteTitle1: "დააზუსტე შენი",
      quoteTitle2: "პროექტი",
      quoteBlurb:
        "გვითხარით თქვენი ავტომობილი, სამიზნე სიმძლავრე და საწვავი. ჩვენი ტექნიკური გუნდი დაადასტურებს თავსებადობას, ვადებსა და საბოლოო ფასს — ჩვეულებრივ ერთი სამუშაო დღის განმავლობაში.",
      unit: "ერთეული",
      listPrice: "საბაზრო ფასი",
      stock: "მარაგი",
      leadTime: "მოლოდინის ვადა",
      leadMade: "3–4 კვირა",
      leadReady: "2–5 დღე",
      fullName: "სრული სახელი",
      phone: "ტელეფონი",
      email: "ელფოსტა",
      vehicleField: "ავტომობილი (მარკა / მოდელი / წელი)",
      targetPower: "სამიზნე სიმძლავრე (ცხ.ძ.)",
      fuel: "საწვავი",
      fuelPlaceholder: "98 / E85 / დიზელი",
      notes: "შენიშვნები",
      notesPlaceholder:
        "დამატებითი მოდიფიკაციები, ვადები და ყველაფერი, რაც უნდა ვიცოდეთ…",
      sendRequest: "მოთხოვნის გაგზავნა",
      requestSent: "მოთხოვნა გაგზავნილია — მალე დაგიკავშირდებით",
      relatedKicker: "იგივე კატეგორია",
      relatedTitle: "შესაძლოა ასევე დაგაინტერესოთ",
      notFoundTitle: "პროდუქტი ვერ მოიძებნა",
      notFoundBlurb:
        "თქვენ მიერ მოძებნილი ერთეული ჩვენს კატალოგში არ არის. შესაძლოა იგი მოხსნილია ან სახელი შეეცვალა.",
      backToCatalog: "კატალოგში დაბრუნება",
      home: "მთავარი",
      catalog: "კატალოგი",
    },
    services: {
      kicker: "შიდა ინჟინერია",
      title1: "ყოველი ტურბო",
      title2: "იმსახურებს",
      title2b: "საკუთარ",
      title3: "წნევას.",
      blurb:
        "ექვსი სპეციალიზებული სამუშაო პროცესი — 60-წუთიანი ხარვეზების სკანირებიდან ორკვირიან სპორტულ პროექტამდე — სრულდება იმავე ინჟინრების მიერ, იმავე სტენდზე, იმავე გატაცებით. აუთსორსინგის გარეშე. მალსახმობების გარეშე.",
      unitsRebuilt: "აღდგენილი ერთეული",
      mmTolerance: "მმ სიზუსტე",
      avgTurnaround: "საშუალო ვადა",
      catalogKicker: "კატალოგი",
      matrixTitle: "სერვისების მატრიცა",
      requestQuote: "ფასის მოთხოვნა",
      eta: "ვადა",
      starting: "საწყისი ფასი",
      methodKicker: "მეთოდი",
      method1: "გაზომილი.",
      method2: "დამუშავებული.",
      method3: "დამონტაჟებული.",
      methodBlurb:
        "ყოველი სამუშაო მიჰყვება იმავე დოკუმენტირებულ პროტოკოლს. თქვენ იღებთ ხელმოწერილ საინსპექციო ანგარიშს, ბალანსის სერტიფიკატსა და დალუქულ საბოლოო ტესტის ჩანაწერს ყოველ ერთეულთან ერთად.",
      scheduleVisit: "ვიზიტის დაგეგმვა",
      warranty1t: "24-თვიანი გარანტია",
      warranty1d:
        "ყოველი აღდგენილი ერთეული იგზავნება 24-თვიანი გარანტიით ნაადრევი გაუმართაობის წინააღმდეგ.",
      warranty2t: "დოკუმენტირებული",
      warranty2d:
        "საინსპექციო, ბალანსისა და საბოლოო ტესტის ანგარიშები ინახება თქვენი პროექტის ID-ით სამუდამოდ.",
      warranty3t: "მთელ კავკასიაში",
      warranty3d:
        "დალუქული მიწოდება საქართველოს, სომხეთისა და აზერბაიჯანის ნებისმიერ წერტილში 48 საათში.",
    },
    showroom: {
      tag: "მთავარი დარბაზი · წერეთლის გამზ. 114, თბილისი",
      title1: "სავიტრინო",
      title2: "დარბაზი",
      hoursLabel: "სამუშაო საათები",
      hoursVal: "ორშ–პარ · 10:00–20:00",
      saturdayLabel: "შაბათი",
      saturdayVal: "11:00–18:00",
      viewingsLabel: "დათვალიერება",
      viewingsVal: "წინასწარი ჩაწერით",
      testFitLabel: "სატესტო მორგება",
      testFitVal: "ადგილზე",
      spaceKicker: "სივრცე",
      spaceTitle1: "ოთახი",
      spaceTitle2: "გატაცებულთათვის.",
      p1: "წერეთლის გამზირზე, უნიშნო ინდუსტრიულ შენობაში, GMS-ის მთავარი დარბაზი ნახევრად გალერეაა, ნახევრად საინჟინრო სტენდი. ყოველი გამოფენილი ტურბოკომპრესორი მუშა ერთეულია — დინოზე შესწავლილი, ხელმოწერილი და გასაგზავნად მზადი.",
      p2: "სივრცე შექმნილია იმ ადამიანებისთვის, ვინც შემოსვლისთანავე უკვე იცის, რა არის A/R კოეფიციენტი. დაჯექით ბარზე, უყურეთ, როგორ ბალანსდება CHRA მინის კედლის მიღმა, და დააზუსტეთ თქვენი შემდეგი პროექტი იმ ინჟინერთან ერთად, ვინც მას აწყობს.",
      bookViewing: "დაჯავშნეთ პირადი ვიზიტი",
      galleryKicker: "გალერეა",
      galleryTitle: "მთავარი დარბაზის შიგნით",
      galleryLead:
        "გადაღებულია ჩვეულებრივ სამშაბათს — დადგმის გარეშე.",
      displayKicker: "გამოფენილი",
      collectionTitle: "კოლექცია",
      fullCatalog: "სრული კატალოგი",
      plinth: "სტენდი",
      visitKicker: "ვიზიტი",
      visit1: "შემოდით.",
      visit2: "დააზუსტეთ.",
      visitBlurb:
        "დათვალიერებისთვის წინასწარი ჩაწერა საჭირო არ არის. პირადი ვიზიტების, სატესტო მორგებისა თუ სპორტული კონსულტაციისთვის დაჯავშნეთ საათი ჩვენს მთავარ ინჟინერთან.",
      addressLabel: "მისამართი",
      callLabel: "ზარი",
      emailLabel: "ელფოსტა",
    },
  },
} as const;

/* --------------------------------------------------------------------------
   Data-value → display-label maps.

   Product data stores these as uppercase enum-ish strings ("IN STOCK",
   "OEM REPLACEMENT") and code compares against those raw values, so the
   stored keys must not change. These maps only affect what a human reads.
   -------------------------------------------------------------------------- */

// Product spec labels repeat across the catalog (same ~8 English strings on
// every product) — translated once here instead of touching every product.
export const SPEC_LABEL_KA: Record<string, string> = {
  "Compressor Wheel": "კომპრესორის ბორბალი",
  "Turbine Wheel": "ტურბინის ბორბალი",
  Housing: "კორპუსი",
  "Max Boost": "მაქს. ბუსტი",
  "Crank HP Potential": "ცხ.ძ. პოტენციალი კრანკზე",
  Cooling: "გაცივება",
  "Bearing System": "საკისრების სისტემა",
  Warranty: "გარანტია",
};

const STOCK_EN: Record<string, string> = {
  "IN STOCK": "In stock",
  "LOW STOCK": "Low stock",
  "MADE TO ORDER": "Made to order",
};

export const STOCK_KA: Record<string, string> = {
  "IN STOCK": "მარაგშია",
  "LOW STOCK": "მცირე მარაგი",
  "MADE TO ORDER": "შეკვეთით",
};

const CATEGORY_EN: Record<string, string> = {
  ALL: "All",
  HYBRID: "Hybrid",
  BILLET: "Billet",
  "OEM REPLACEMENT": "OEM replacement",
  COMPETITION: "Competition",
};

export const CATEGORY_KA: Record<string, string> = {
  ALL: "ყველა",
  HYBRID: "ჰიბრიდი",
  BILLET: "ბილეტი",
  "OEM REPLACEMENT": "OEM ჩანაცვლება",
  COMPETITION: "სპორტული",
};

// Marques keep their own house styling (BMW and VW are genuinely initialisms;
// Porsche and Subaru are not).
const VEHICLE_EN: Record<string, string> = {
  ALL: "All makes",
  BMW: "BMW",
  AUDI: "Audi",
  VW: "VW",
  MERCEDES: "Mercedes",
  PORSCHE: "Porsche",
  SUBARU: "Subaru",
  TOYOTA: "Toyota",
  NISSAN: "Nissan",
};

export function specLabel(label: string, lang: Lang): string {
  return lang === "KA" ? (SPEC_LABEL_KA[label] ?? label) : label;
}

export function stockLabel(stock: string, lang: Lang): string {
  return lang === "KA"
    ? (STOCK_KA[stock] ?? stock)
    : (STOCK_EN[stock] ?? stock);
}

export function categoryLabel(category: string, lang: Lang): string {
  return lang === "KA"
    ? (CATEGORY_KA[category] ?? category)
    : (CATEGORY_EN[category] ?? category);
}

export function vehicleLabel(vehicle: string, lang: Lang): string {
  if (vehicle === "ALL") return lang === "KA" ? "ყველა მარკა" : "All makes";
  return VEHICLE_EN[vehicle] ?? vehicle;
}

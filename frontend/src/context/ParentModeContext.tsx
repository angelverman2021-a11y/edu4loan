import React, { createContext, useContext, useState, useEffect } from "react";
import { ParentModeLanguage, ParentModeDictionary, TermDefinition } from "@/types";

const DICTIONARIES: Record<ParentModeLanguage, ParentModeDictionary> = {
  en: {
    language: "en",
    languageName: "English",
    nativeName: "English",
    labels: {
      parentModeTitle: "Parent-Friendly Guidance Mode",
      parentModeSubtitle: "Simplified, jargon-free explanations to help parents make informed financial decisions without altering legal conditions.",
      switchLanguage: "Select Language",
      simpleExplanation: "Simple Explanation",
      officialWording: "Official Banking Term",
      whyThisMatters: "Why This Matters for Parents",
      preparationProgress: "Dossier Preparation Progress",
      preparationNote: "Document preparation progress only. This is not an approval guarantee.",
      studentInformation: "Student & Course Overview",
      estimatedObligation: "Estimated Monthly Obligation (Post-Moratorium)",
      parentActionRequired: "Action Required by Parent / Co-Borrower",
    },
    terms: {
      collateral: {
        termKey: "collateral",
        canonicalEnglish: "Collateral Security",
        localizedTerm: "Property or Asset Security",
        simpleExplanation: "An asset (such as a house, land, or fixed deposit) pledged to the bank as security in case the borrower cannot repay.",
        officialWording: "Tangible security of adequate value along with assignment of future cash flows and mortgage creation.",
        whyThisMatters: "Under central government CGFSEL rules, education loans up to ₹7.5 Lakhs are 100% COLLATERAL-FREE.",
        practicalTip: "Never hand over original property title deeds without an official loan sanction letter in hand.",
      },
      moratorium: {
        termKey: "moratorium",
        canonicalEnglish: "Moratorium Period",
        localizedTerm: "Study Period + Job Search Buffer",
        simpleExplanation: "A repayment holiday during college years plus 1 year post-graduation where full EMIs are paused.",
        officialWording: "Repayment holiday comprising course duration plus 1 year or 6 months after securing employment, whichever is earlier.",
        whyThisMatters: "Interest starts accruing from Day 1. Paying simple interest monthly during college earns you a 1% interest discount.",
        practicalTip: "If family cash flow allows, paying simple interest every month prevents the loan balance from ballooning.",
      },
      margin: {
        termKey: "margin",
        canonicalEnglish: "Margin Money",
        localizedTerm: "Family Contribution Share",
        simpleExplanation: "The portion of university fees that parents must pay from their own pocket. The bank funds the remainder.",
        officialWording: "Student/co-borrower contribution towards educational expenses over and above the bank loan quantum.",
        whyThisMatters: "0% margin up to ₹4 Lakhs. For loans above ₹4 Lakhs for Indian studies, parents must arrange 5% in cash.",
        practicalTip: "College counseling fees and admission advance receipts count towards your margin money.",
      },
      coApplicant: {
        termKey: "coApplicant",
        canonicalEnglish: "Co-Applicant / Co-Borrower",
        localizedTerm: "Parent Co-Signer",
        simpleExplanation: "A parent or legal guardian who signs the loan contract jointly and shares full legal responsibility for repayment.",
        officialWording: "Joint borrower who accepts co-obligation and signs the loan agreement jointly and severally with the student.",
        whyThisMatters: "Banks check the parent's CIBIL credit score and income proof, not the student's.",
        practicalTip: "Ensure the co-borrower has clean credit with no unpaid credit card dues or defaulted loans.",
      },
    },
  },
  hi: {
    language: "hi",
    languageName: "Hindi",
    nativeName: "हिंदी",
    labels: {
      parentModeTitle: "अभिभावक सहायता मोड (Parent Mode)",
      parentModeSubtitle: "माता-पिता के लिए आसान भाषा में शिक्षा ऋण की पूरी जानकारी, बिना किसी भ्रामक वादों के।",
      switchLanguage: "भाषा चुनें",
      simpleExplanation: "आसान भाषा में समझें",
      officialWording: "बैंक की आधिकारिक भाषा",
      whyThisMatters: "माता-पिता के लिए यह क्यों महत्वपूर्ण है",
      preparationProgress: "दस्तावेज़ तैयारी प्रगति",
      preparationNote: "यह केवल दस्तावेज़ तैयारी का स्कोर है, कोई ऋण स्वीकृति की गारंटी नहीं।",
      studentInformation: "छात्र एवं पाठ्यक्रम विवरण",
      estimatedObligation: "पढ़ाई के बाद अनुमानित मासिक किस्त (EMI)",
      parentActionRequired: "अभिभावक द्वारा आवश्यक कदम",
    },
    terms: {
      collateral: {
        termKey: "collateral",
        canonicalEnglish: "Collateral Security",
        localizedTerm: "जमानत / गिरवी रखी जाने वाली संपत्ति",
        simpleExplanation: "बैंक में सुरक्षा के रूप में जमा की जाने वाली संपत्ति (जैसे मकान, दुकान या फिक्स्ड डिपॉजिट)।",
        officialWording: "ऋण राशि के समतुल्य अचल संपत्ति या वित्तीय प्रतिभूतियों का बंधक।",
        whyThisMatters: "आरबीआई और केंद्र सरकार के नियमों के अनुसार ₹7.5 लाख तक के लोन के लिए कोई भी संपत्ति गिरवी नहीं रखनी होती।",
        practicalTip: "जब तक बैंक का औपचारिक स्वीकृति पत्र न मिले, किसी को भी मूल रजिस्ट्री के कागजात न दें।",
      },
      moratorium: {
        termKey: "moratorium",
        canonicalEnglish: "Moratorium Period",
        localizedTerm: "पढ़ाई की अवधि + 1 वर्ष की छूट (Moratorium)",
        simpleExplanation: "कॉलेज के 4 साल और उसके बाद 1 साल तक किस्त (EMI) न भरने की छूट का समय।",
        officialWording: "कोर्स की अवधि और उसके बाद 1 वर्ष अथवा नौकरी मिलने के 6 महीने (जो भी पहले हो) की पुनर्भुगतान छूट।",
        whyThisMatters: "पढ़ाई के दौरान ब्याज लगना शुरू हो जाता है। यदि हर महीने ब्याज भरते रहें, तो 1% की विशेष छूट मिलती है।",
        practicalTip: "संभव हो तो पढ़ाई के दौरान साधारण ब्याज भरते रहें, ताकि बाद में कर्ज का बोझ अचानक न बढ़े।",
      },
      margin: {
        termKey: "margin",
        canonicalEnglish: "Margin Money",
        localizedTerm: "परिवार का हिस्सा (Margin Money)",
        simpleExplanation: "कॉलेज की फीस का वह हिस्सा जो परिवार को अपनी जेब से भरना होता है। बाकी बैंक देता है।",
        officialWording: "बैंक द्वारा स्वीकृत ऋण राशि के अतिरिक्त आवेदक द्वारा वहन किया जाने वाला अंशदान।",
        whyThisMatters: "₹4 लाख तक 0% मार्जिन है। ₹4 लाख से अधिक के लोन पर परिवार को केवल 5% पैसा खुद लगाना होता है।",
        practicalTip: "शुरुआती काउंसलिंग और सीट बुकिंग की रसीदें मार्जिन मनी में गिनी जाती हैं।",
      },
      coApplicant: {
        termKey: "coApplicant",
        canonicalEnglish: "Co-Applicant / Co-Borrower",
        localizedTerm: "संयुक्त कर्जदार (माता-पिता)",
        simpleExplanation: "पिता या माता जो छात्र के साथ ऋण पत्र पर हस्ताक्षर करते हैं और चुकाने की संयुक्त जिम्मेदारी लेते हैं।",
        officialWording: "ऋण समझौते में छात्र के साथ संयुक्त एवं व्यक्तिगत रूप से उत्तरदायी सह-उधारकर्ता।",
        whyThisMatters: "बैंक छात्र का नहीं, बल्कि माता-पिता का सिबिल (CIBIL) स्कोर और आमदनी देखता है।",
        practicalTip: "माता-पिता के पैन कार्ड और बैंक खाते में कोई पुराना डिफॉल्ट या बकाया नहीं होना चाहिए।",
      },
    },
  },
  gu: {
    language: "gu",
    languageName: "Gujarati",
    nativeName: "ગુજરાતી",
    labels: {
      parentModeTitle: "વાલી સહાયતા મોડ (Parent Mode)",
      parentModeSubtitle: "માતા-પિતા માટે સરળ અને સ્પષ્ટ ભાષામાં એજ્યુકેશન લોનની માર્ગદર્શિકા.",
      switchLanguage: "ભાષા પસંદ કરો",
      simpleExplanation: "સરળ સમજૂતી",
      officialWording: "બેંકની સત્તાવાર શરતો",
      whyThisMatters: "વાલીઓ માટે શા માટે મહત્વપૂર્ણ છે",
      preparationProgress: "દસ્તાવેજ તૈયારી પ્રગતિ",
      preparationNote: "આ માત્ર દસ્તાવેજોની તૈયારીનું સ્તર છે, લોન મંજૂરીની ખાતરી નથી.",
      studentInformation: "વિદ્યાર્થી અને કોર્સની વિગતો",
      estimatedObligation: "અભ્યાસ પૂર્ણ થયા પછી અંદાજિત માસિક હપ્તો (EMI)",
      parentActionRequired: "વાલી દ્વારા જરૂરી કાર્યવાહી",
    },
    terms: {
      collateral: {
        termKey: "collateral",
        canonicalEnglish: "Collateral Security",
        localizedTerm: "મિલકત ગેરંટી / જામીનગીરી",
        simpleExplanation: "બેંકમાં સુરક્ષા તરીકે ગીરવે મુકાતી મિલકત (જેમ કે મકાન, જમીન અથવા ફિક્સ ડિપોઝિટ).",
        officialWording: "યોગ્ય મૂલ્ય ધરાવતી સ્થાવર અથવા જંગમ મિલકતનું બેંક પાસે ગીરો.",
        whyThisMatters: "RBI ના નિયમો મુજબ ₹7.5 લાખ સુધીની લોન માટે કોઈ પણ મિલકત ગીરવે મૂકવાની જરૂર નથી.",
        practicalTip: "બેંક તરફથી સત્તાવાર લોન મંજૂરી પત્ર ન મળે ત્યાં સુધી અસલ દસ્તાવેજો સોંપવા નહીં.",
      },
      moratorium: {
        termKey: "moratorium",
        canonicalEnglish: "Moratorium Period",
        localizedTerm: "અભ્યાસનો સમયગાળો + 1 વર્ષની રાહત",
        simpleExplanation: "કોલેજના અભ્યાસ દરમિયાન અને તે પછી 1 વર્ષ સુધી હપ્તો (EMI) ભરવામાંથી મુક્તિનો સમય.",
        officialWording: "કોર્સનો સમયગાળો ઉપરાંત 1 વર્ષ અથવા નોકરી મળ્યાના 6 મહિના સુધી પુનઃચુકવણી મુક્તિ.",
        whyThisMatters: "અભ્યાસ દરમિયાન પણ વ્યાજ ચાલુ રહે છે. જો દર મહિને વ્યાજ ભરો તો 1% સુધીનું ડિસ્કાઉન્ટ મળે છે.",
        practicalTip: "શક્ય હોય તો દર મહિને સાદું વ્યાજ ભરતા રહેવું જેથી પાછળથી બોજ ઓછો રહે.",
      },
      margin: {
        termKey: "margin",
        canonicalEnglish: "Margin Money",
        localizedTerm: "પરિવારનો હિસ્સો (Margin)",
        simpleExplanation: "કોલેજ ફીનો એવો ભાગ જે પરિવારે પોતાના પૈસે ભરવાનો હોય છે. બાકીની રકમ બેંક ચૂકવે છે.",
        officialWording: "કુલ શૈક્ષણિક ખર્ચમાંથી વિદ્યાર્થી/વાલી દ્વારા ચૂકવવાનો થતો હિસ્સો.",
        whyThisMatters: "₹4 લાખ સુધી 0% માર્જિન છે. ₹4 લાખથી વધુની લોન પર માત્ર 5% રકમ વાલીએ આપવાની રહે છે.",
        practicalTip: "કાઉન્સેલિંગ વખતે ભરેલી સીટ બુકિંગ ફી પણ માર્જિન મનીમાં ગણાઈ જાય છે.",
      },
      coApplicant: {
        termKey: "coApplicant",
        canonicalEnglish: "Co-Applicant / Co-Borrower",
        localizedTerm: "સહ-અરજદાર (વાલી)",
        simpleExplanation: "માતા અથવા પિતા જે વિદ્યાર્થી સાથે લોન કરાર પર સહી કરે છે અને સંયુક્ત જવાબદારી લે છે.",
        officialWording: "વિદ્યાર્થી સાથે લોન ચૂકવણી માટે કાયદેસર રીતે સંયુક્ત જવાબદાર વાલી.",
        whyThisMatters: "બેંક વિદ્યાર્થીનો નહીં પરંતુ વાલીનો CIBIL સ્કોર અને આવકના પુરાવા તપાસે છે.",
        practicalTip: "વાલીના ક્રેડિટ કાર્ડ કે અગાઉની લોનમાં કોઈ બાકી લેણું ન હોવું જોઈએ.",
      },
    },
  },
  bn: {
    language: "bn",
    languageName: "Bengali",
    nativeName: "বাংলা",
    labels: {
      parentModeTitle: "অভিভাবক সহায়িকা মোড (Parent Mode)",
      parentModeSubtitle: "পিতামাতার জন্য সহজ ও স্পষ্ট ভাষায় এডুকেশন লোনের সঠিক তথ্য।",
      switchLanguage: "ভাষা নির্বাচন করুন",
      simpleExplanation: "সহজ ভাষায় ব্যাখ্যা",
      officialWording: "ব্যাংকের প্রাতিষ্ঠানিক ভাষা",
      whyThisMatters: "পিতামাতার জন্য কেন গুরুত্বপূর্ণ",
      preparationProgress: "নথিপত্র প্রস্তুতির অগ্রগতি",
      preparationNote: "এটি কেবল কাগজপত্র প্রস্তুতির পরিমাপ, ঋণ অনুমোদনের নিশ্চয়তা নয়।",
      studentInformation: "ছাত্র এবং পাঠ্যক্রমের বিবরণ",
      estimatedObligation: "পড়াশোনা শেষ হওয়ার পর আনুমানিক মাসিক কিস্তি (EMI)",
      parentActionRequired: "অভিভাবকের করণীয় পদক্ষেপ",
    },
    terms: {
      collateral: {
        termKey: "collateral",
        canonicalEnglish: "Collateral Security",
        localizedTerm: "বন্ধক / সম্পত্তি জামানত",
        simpleExplanation: "ব্যাংকের কাছে নিরাপত্তার জন্য জমা রাখা সম্পত্তি (যেমন বাড়ি, জমি বা ফিক্সড ডিপোজিট)।",
        officialWording: "উপযুক্ত মূল্যের স্থাবর বা অস্থাবর সম্পত্তির ওপর ব্যাংক কর্তৃক বন্ধক সৃষ্টি।",
        whyThisMatters: "RBI এবং কেন্দ্রীয় সরকারের নিয়ম অনুযায়ী ₹৭.৫ লাখ পর্যন্ত কোনো সম্পত্তি বন্ধক রাখতে হয় না।",
        practicalTip: "ব্যাংকের অফিসিয়াল স্যাংশন লেটার না পাওয়া পর্যন্ত মূল দলিল কাউকে হস্তান্তর করবেন না।",
      },
      moratorium: {
        termKey: "moratorium",
        canonicalEnglish: "Moratorium Period",
        localizedTerm: "পড়াশোনার সময়কাল + ১ বছরের অবকাশ",
        simpleExplanation: "কলেজে পড়ার সময় এবং পাস করার পর ১ বছর পর্যন্ত কিস্তি (EMI) না দেওয়ার সরকারি সুবিধা।",
        officialWording: "পাঠ্যক্রমের সময়সীমা এবং পরবর্তী ১ বছর বা চাকরি পাওয়ার ৬ মাসের অবকাশকালীন সময়।",
        whyThisMatters: "পড়াশোনার সময়ও সুদ যুক্ত হতে থাকে। প্রতি মাসে কেবল সুদ পরিশোধ করলে ১% বিশেষ ছাড় পাওয়া যায়।",
        practicalTip: "সম্ভব হলে পড়ার সময় প্রতি মাসে সাধারণ সুদ পরিশোধ করুন, এতে মূল ঋণ বৃদ্ধি পাবে না।",
      },
      margin: {
        termKey: "margin",
        canonicalEnglish: "Margin Money",
        localizedTerm: "পরিবারের নিজস্ব অংশ (Margin Money)",
        simpleExplanation: "কলেজের খরচের যে অংশটি পরিবারকে নিজের পকেট থেকে দিতে হয়। বাকি অংশ ব্যাংক দেয়।",
        officialWording: "অনুমোদিত মোট খরচের ওপর আবেদনকারীর নিজস্ব বহনযোগ্য শতকরা অংশ।",
        whyThisMatters: "₹৪ লাখ পর্যন্ত ০% মার্জিন। ₹৪ লাখের বেশি লোনের ক্ষেত্রে পরিবারকে কেবল ৫% টাকা বহন করতে হয়।",
        practicalTip: "কাউন্সেলিং ও সিট বুকিংয়ের সময় দেওয়া অগ্রিম ফি মার্জিন মানির অন্তর্ভুক্ত হিসেবে গণ্য হয়।",
      },
      coApplicant: {
        termKey: "coApplicant",
        canonicalEnglish: "Co-Applicant / Co-Borrower",
        localizedTerm: "যৌথ ঋণগ্রহীতা (পিতামাতা)",
        simpleExplanation: "পিতা বা মাতা যিনি ছাত্রের সাথে ঋণ চুক্তিতে স্বাক্ষর করেন এবং ঋণ পরিশোধের যৌথ দায়িত্ব নেন।",
        officialWording: "শিক্ষার্থীর সাথে ঋণ পরিশোধে যৌথ ও ব্যক্তিগতভাবে দায়ী সহ-ঋণগ্রহীতা।",
        whyThisMatters: "ব্যাংক শিক্ষার্থীর নয়, পিতামাতার সিভিল (CIBIL) স্কোর এবং আয়ের প্রমাণ খতিয়ে দেখে।",
        practicalTip: "পিতামাতার ক্রেডিট কার্ড বা অন্য লোনের কিস্তি সময়মতো পরিশোধ থাকা অত্যন্ত জরুরি।",
      },
    },
  },
};

interface ParentModeContextType {
  isParentMode: boolean;
  setIsParentMode: (val: boolean) => void;
  language: ParentModeLanguage;
  setLanguage: (lang: ParentModeLanguage) => void;
  dictionary: ParentModeDictionary;
  getTerm: (key: string) => TermDefinition | undefined;
}

const ParentModeContext = createContext<ParentModeContextType | undefined>(undefined);

export const ParentModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isParentMode, setIsParentModeState] = useState<boolean>(() => {
    return localStorage.getItem("edu4loan_parent_mode") === "true";
  });

  const [language, setLanguageState] = useState<ParentModeLanguage>(() => {
    const saved = localStorage.getItem("edu4loan_parent_lang");
    if (saved === "hi" || saved === "gu" || saved === "bn" || saved === "en") {
      return saved as ParentModeLanguage;
    }
    return "en";
  });

  const setIsParentMode = (val: boolean) => {
    setIsParentModeState(val);
    localStorage.setItem("edu4loan_parent_mode", val ? "true" : "false");
  };

  const setLanguage = (lang: ParentModeLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("edu4loan_parent_lang", lang);
  };

  const dictionary = DICTIONARIES[language] || DICTIONARIES.en;

  const getTerm = (key: string): TermDefinition | undefined => {
    return dictionary.terms[key] || DICTIONARIES.en.terms[key];
  };

  return (
    <ParentModeContext.Provider
      value={{
        isParentMode,
        setIsParentMode,
        language,
        setLanguage,
        dictionary,
        getTerm,
      }}
    >
      {children}
    </ParentModeContext.Provider>
  );
};

export const useParentMode = () => {
  const ctx = useContext(ParentModeContext);
  if (!ctx) {
    throw new Error("useParentMode must be used within a ParentModeProvider");
  }
  return ctx;
};

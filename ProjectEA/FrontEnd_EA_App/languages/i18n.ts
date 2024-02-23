
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStoragePlugin from 'i18next-react-native-async-storage';
import * as Localization from 'expo-localization';
import translationEN from './english.json';
import translationES from './español.json';
import translationPT from './portugese.json';
import translationDE from './deutsch.json';

i18next
  .use(initReactI18next)
  //.use(AsyncStoragePlugin('en'))
  .init({
   
    keySeparator:false,
    lng:Localization.locale,
    fallbackLng: {
        'es-ES': ['es', 'en'],
        default: ['en'],
      },
    interpolation:{
        escapeValue:false,
    },
    resources:{
        en:
            translationEN,
        
        es:
            translationES,
        
        pt:
            translationPT,
        
        de:
            translationDE,
        

    },
    react:{
        useSuspense:false,
    }
    
  });
export default i18next;


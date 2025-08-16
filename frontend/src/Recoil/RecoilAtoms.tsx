import { atom } from "recoil";

export const messageAtom = atom({
      key:"messageAtom",
      default:'',
});

export const codeAtom = atom({
      key:"codeAtom",
      default:'',
});

export const explanationTextAtom = atom({
     key:"explanationTextatom",
     default:''
});

export const languageAtom = atom({
       key:"languageAtom",
       default:'',
});

export const isFullHeightAtom = atom({
       key:"isFullHeightatom",
       default: false 
});

export const inputAtom = atom({
      key:"inputAtom",
      default:''
});

export const loadingAtom = atom({
        key:"loadingAtom",
        default: false
});

export const divRefatom = atom({
       key: "divRefatom",
       default: null
});
 
export const isactiveAtom = atom({
       key: "isactiveAtom",
       default: 'code'
});

export const outputAtom = atom({
      key:"outputAtom",
      default:''
})

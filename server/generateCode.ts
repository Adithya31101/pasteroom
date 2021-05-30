class codeHelper {
   codes: { code: string; inUse: boolean; adminId: null | string }[];
   constructor() {
      this.codes = [
      {code: "COAL", inUse: false, adminId: null},
      {code: "FLAT", inUse: false, adminId: null},
      {code: "COOL", inUse: false, adminId: null},
      {code: "HALT", inUse: false, adminId: null},
      {code: "BELL", inUse: false, adminId: null},
      {code: "TURN", inUse: false, adminId: null},
      {code: "SCAM", inUse: false, adminId: null},
      {code: "BURN", inUse: false, adminId: null},
      {code: "SEND", inUse: false, adminId: null},
      {code: "LIKE", inUse: false, adminId: null},
   ];
   }

   getUnusedCode(adminId: string): string | null {
      let i = 0;
      while(this.codes[i].inUse && i < this.codes.length){
         i++;
      }
      if(i === this.codes.length) return null;
      this.codes[i].inUse = true;
      this.codes[i].adminId = adminId;
      return this.codes[i].code;
   }
   
   freeCode(adminId: string): boolean{
      const i = this.codes.findIndex(code => code.adminId === adminId);
      if(i !== -1){
         this.codes[i].inUse = false;
         this.codes[i].adminId = null;
         return true;
      } else {
         return false;
      }
   }

   getCodeToEmit(adminId: string): string | null {
      const codeObj = this.codes.find(c => c.adminId === adminId);
      if(codeObj){
         return codeObj.code;
      } else {
         return null;
      }
   }

   validateCode(code: string): boolean{
      const codeObj = this.codes.find(c => c.code === code);
      if(codeObj && codeObj.inUse){
         return true;
      } else {
         return false;
      }
   }
}

export default new codeHelper();
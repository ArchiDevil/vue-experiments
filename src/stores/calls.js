import { defineStore } from "pinia";

export const useCallsStore = defineStore('calls', {
    state: () => {
        return { selectedCall: null }
    },

    actions: {
        selectCall(call) {
            this.selectedCall = call;
        }
    }
})

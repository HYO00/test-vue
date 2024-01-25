import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTableStore = defineStore('tableStore', () => {
    // 반응형 상태 정의
    const sourceData = ref('');
    const targetData = ref('');


    // setup 스토어 반환
    return { 
        sourceData,
        targetData
    };
});

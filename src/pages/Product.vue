<template>
  <v-container
    fluid
    class="product-search-container"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card class="product-search-card pa-5">
          <v-card-title class="text-center text-h5 font-weight-bold">
            {{ t('Search_Title') }}
          </v-card-title>
          <v-divider class="my-4" />
          <v-card-text>
            <v-form @submit.prevent="onSearch">
              <v-text-field
                v-model="searchForm.name"
                :label="t('SortBy_Name')"
                :placeholder="t('Search_Name_Placeholder')"
                variant="outlined"
                class="mb-4"
              />

              <v-select
                v-model="searchForm.productGroup"
                :items="groupItems"
                :label="t('Search_Group')"
                variant="outlined"
                class="mb-4"
              />

              <div class="d-flex justify-center">
                <v-btn
                  type="submit"
                  :loading="isLoading"
                  color="brown-darken-1"
                  class="mx-2 action-btn"
                >
                  {{ t('Search_Btn') }}
                </v-btn>
                <v-btn
                  variant="outlined"
                  color="brown"
                  class="mx-2 action-btn"
                  @click="onReset"
                >
                  {{ t('Search_Reset_Btn') }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { componentText, contentSystem, productGroup } from '@/assets/static/productlist';

// ข้อความทั้งหมด (ปุ่ม/ฟอร์ม + เนื้อหา) รวมเป็นชุดเดียวไว้ค้นด้วย Name
const TEXTS = [...componentText, ...contentSystem];

export default defineComponent({
  name: 'ProductSearch',
  setup() {
    const store = useStore();
    const languageSystem = computed(() => store.state.config.language);
    return { languageSystem };
  },
  data() {
    return {
      searchForm: {
        name: '',
        productGroup: 'All',
      },
      isLoading: false,
    };
  },
  computed: {
    // ตัวเลือกกลุ่มสินค้า: "All" แปลตามภาษา ส่วนชื่อกลุ่มใช้ตามข้อมูล
    groupItems() {
      return [
        { title: this.t('Search_All'), value: 'All' },
        ...productGroup.map((group) => ({ title: group, value: group })),
      ];
    },
  },
  methods: {
    t(name) {
      const row = TEXTS.find((item) => item.Name === name);
      return row?.[this.languageSystem] ?? name;
    },
    // ไปหน้า ProductList พร้อม query เฉพาะค่าที่กรอก
    async onSearch() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const name = (this.searchForm.name || '').trim();
        const group = this.searchForm.productGroup;

        const query = {};
        if (name) query.name = name;
        if (group && group !== 'All') query.productGroup = group;

        await this.$router.push({ name: 'ProductList', query });
      } finally {
        this.isLoading = false;
      }
    },
    onReset() {
      this.searchForm = {
        name: '',
        productGroup: 'All',
      };
    },
  },
});
</script>

<style scoped>
.product-search-container {
  width: 100%;
  min-height: 62.6vh;
}

.product-search-card {
  background-color: #f5f2ee;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.action-btn {
  min-width: 100px;
}
</style>

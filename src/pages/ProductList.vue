<template>
  <v-container
    class="product-list"
    fluid
  >
    <v-row dense>
      <!-- Sidebar Filter -->
      <v-col
        cols="12"
        md="4"
      >
        <v-card class="sidebar">
          <v-card-title>{{ t('Filter_Header') }}</v-card-title>
          <v-divider />
          <v-card-text>
            <!-- Search Name Field -->
            <v-text-field
              v-model="searchName"
              :label="t('Filter_SearchName')"
              variant="outlined"
              density="compact"
              class="mb-4"
            />

            <!-- Country filter -->
            <v-select
              v-model="selectedCountries"
              :items="countryItems"
              :label="countryTitle[languageSystem]"
              multiple
              chips
              closable-chips
              variant="outlined"
              density="compact"
              class="mb-4"
            />

            <!-- Multi-select group filter -->
            <v-row dense>
              <v-col
                v-for="option in groupOptions"
                :key="option"
                cols="6"
              >
                <v-checkbox
                  v-model="selectedGroups"
                  :label="option"
                  :value="option"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="my-4" />
          <v-btn
            color="primary"
            block
            @click="resetFilters"
          >
            {{ t('Filter_Reset_Btn') }}
          </v-btn>
        </v-card>
      </v-col>

      <!-- Main Product Table Section -->
      <v-col
        cols="12"
        md="8"
      >
        <v-data-table
          v-model:page="page"
          :headers="headers"
          :items="filteredProducts"
          :no-data-text="t('Table_NoData')"
          multi-sort
          class="elevation-1"
        >
          <template #[`item.name`]="{ item }">
            <v-btn
              variant="text"
              :to="{ name: 'ProductDetail', params: { name: String(item.name) } }"
            >
              {{ item.name }}
            </v-btn>
          </template>
          <template #[`item.country`]="{ item }">
            {{ countryNames(item.countries) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import {
  componentText,
  contentSystem,
  productGroup,
} from '@/assets/static/productlist';
import {
  countryLabel,
  countryOptions,
  countryTitle,
  productsWithCountry,
} from '@/assets/static/productcountry';

const TEXTS = [...componentText, ...contentSystem];

// query ของ vue-router เป็นได้ทั้ง string | string[] | null
const first = (value) => (Array.isArray(value) ? value[0] : value);

// แปลงค่าที่คั่นด้วยจุลภาคใน URL เป็นอาร์เรย์ และเก็บเฉพาะค่าที่มีอยู่จริง
const parseList = (value, allowed) => {
  const text = first(value);
  if (!text || text === 'All') return [];
  return text.split(',').filter((item) => allowed.includes(item));
};

export default defineComponent({
  name: 'ProductList',
  setup() {
    const store = useStore();
    const languageSystem = computed(() => store.state.config.language);
    return { languageSystem };
  },
  data() {
    return {
      groupOptions: productGroup, // ตัวเลือกกลุ่มทั้งหมด
      selectedGroups: [], // กลุ่มที่เลือก
      selectedCountries: [], // ประเทศที่เลือก
      searchName: '', // คำค้นหาชื่อ
      products: productsWithCountry, // สินค้าพร้อมฟิลด์ country
      countryTitle,
      page: 1,
    };
  },
  computed: {
    headers() {
      return [
        { title: this.t('SortBy_Name'), value: 'name', sortable: true },
        { title: this.t('SortBy_Group'), value: 'group', sortable: true },
        { title: countryTitle[this.languageSystem], value: 'country', sortable: true },
      ];
    },
    // ตัวเลือกประเทศ แสดงชื่อตามภาษา เก็บค่าเป็นชื่ออังกฤษ
    countryItems() {
      return countryOptions.map((key) => ({
        title: this.countryName(key),
        value: key,
      }));
    },
    // กรองที่เดียว (ชื่อ + กลุ่ม + ประเทศ) แล้วส่งให้ตารางแสดงผลตรงๆ
    filteredProducts() {
      const keyword = (this.searchName || '').trim().toLowerCase();
      return this.products.filter((product) => {
        const matchesName = !keyword
          || String(product.name).toLowerCase().includes(keyword);
        const matchesGroup = !this.selectedGroups.length
          || this.selectedGroups.includes(product.group);
        const matchesCountry = !this.selectedCountries.length
          || this.selectedCountries.some((c) => product.countries.includes(c));
        return matchesName && matchesGroup && matchesCountry;
      });
    },
  },
  watch: {
    // อ่านตัวกรองจาก URL ทั้งตอนเปิดหน้าและตอน query เปลี่ยน
    // (เช่น มาจากการ์ดหมวดสินค้าหรือฟอร์มค้นหา)
    '$route.query': { immediate: true, handler: 'applyQuery' },
    // ตัวกรองเปลี่ยนแล้วกลับไปหน้าแรกของตาราง
    filteredProducts() {
      this.page = 1;
    },
  },
  methods: {
    t(name) {
      const row = TEXTS.find((item) => item.Name === name);
      return row?.[this.languageSystem] ?? name;
    },
    // ชื่อประเทศตามภาษา ("-" ถ้ายังไม่มีข้อมูล)
    countryName(key) {
      return countryLabel[key]?.[this.languageSystem] ?? '-';
    },
    // หลายประเทศคั่นด้วยจุลภาค ("-" ถ้ายังไม่มีข้อมูล)
    countryNames(keys) {
      return keys?.length
        ? keys.map((key) => this.countryName(key)).join(', ')
        : '-';
    },
    applyQuery(query = this.$route.query) {
      // ถ้า component ยังค้างอยู่ตอนเปลี่ยนไปหน้าอื่น (เช่น keep-alive) ไม่ต้องรีเซ็ตตัวกรอง
      if (this.$route.name !== 'ProductList') return;

      this.searchName = first(query.name) || '';
      this.selectedGroups = parseList(query.productGroup, this.groupOptions);
      this.selectedCountries = parseList(query.country, countryOptions);
    },
    resetFilters() {
      this.searchName = '';
      this.selectedGroups = [];
      this.selectedCountries = [];
      // ล้าง query ใน URL ด้วย ไม่งั้น refresh แล้วตัวกรองกลับมา
      if (Object.keys(this.$route.query).length) {
        this.$router.replace({ name: 'ProductList', query: {} });
      }
    },
  },
});
</script>

<style scoped>
.product-list {
  margin-top: 20px;
}

.sidebar {
  background-color: #f5f2ee;
  padding: 20px;
}
</style>

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
          <v-card-title class="d-flex align-center justify-space-between">
            <span>{{ t('Filter_Header') }}</span>
            <v-btn
              color="primary"
              size="small"
              @click="resetFilters"
            >
              {{ t('Filter_Reset_Btn') }}
            </v-btn>
          </v-card-title>
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
              @click="openBooking(item.name)"
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

    <!-- หน้าต่างนัดหมายสินค้า -->
    <v-dialog
      v-model="bookingDialog"
      max-width="480"
    >
      <v-card>
        <v-card-title>{{ bookingText.title }}</v-card-title>
        <v-card-text>
          <div class="booking-product">
            {{ bookingProduct }}
          </div>
          <p class="mt-3">
            {{ bookingText.hint }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="text"
            @click="bookingDialog = false"
          >
            {{ bookingText.close }}
          </v-btn>
          <v-spacer />
          <v-btn
            variant="outlined"
            color="brown"
            @click="copyProduct"
          >
            {{ copied ? bookingText.copied : bookingText.copy }}
          </v-btn>
          <v-btn
            :href="bookingUrl"
            target="_blank"
            rel="noopener"
            color="brown"
            @click="bookingDialog = false"
          >
            {{ bookingText.go }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  countryTitle,
  productsWithCountry,
} from '@/assets/static/productcountry';

const TEXTS = [...componentText, ...contentSystem];

// ลิงก์หน้านัดหมายของ Odoo
const BOOKING_URL = 'https://ksmachukij.odoo.com/book/d2b79429';

const BOOKING_TEXT = {
  TH: {
    title: 'นัดหมายสินค้า',
    hint: 'กด "คัดลอกชื่อสินค้า" แล้วนำไปวางในช่อง "สินค้าที่สนใจ" ในหน้านัดหมาย',
    copy: 'คัดลอกชื่อสินค้า',
    copied: 'คัดลอกแล้ว',
    go: 'ไปหน้านัดหมาย',
    close: 'ปิด',
  },
  EN: {
    title: 'Book an appointment',
    hint: 'Click "Copy product name", then paste it into the "Product of interest" field on the booking page.',
    copy: 'Copy product name',
    copied: 'Copied',
    go: 'Go to booking page',
    close: 'Close',
  },
};

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
      searchName: '', // คำค้นหาชื่อ
      products: productsWithCountry, // สินค้าพร้อมฟิลด์ country
      page: 1,
      bookingUrl: BOOKING_URL,
      bookingDialog: false,
      bookingProduct: '',
      copied: false,
    };
  },
  computed: {
    bookingText() {
      return BOOKING_TEXT[this.languageSystem] ?? BOOKING_TEXT.EN;
    },
    headers() {
      return [
        { title: this.t('SortBy_Name'), value: 'name', sortable: true },
        { title: this.t('SortBy_Group'), value: 'group', sortable: true },
        { title: countryTitle[this.languageSystem], value: 'country', sortable: true },
      ];
    },
    // กรองที่เดียว (ชื่อ + กลุ่ม) แล้วส่งให้ตารางแสดงผลตรงๆ
    filteredProducts() {
      const keyword = (this.searchName || '').trim().toLowerCase();
      return this.products.filter((product) => {
        const matchesName = !keyword
          || String(product.name).toLowerCase().includes(keyword);
        const matchesGroup = !this.selectedGroups.length
          || this.selectedGroups.includes(product.group);
        return matchesName && matchesGroup;
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
    // เปิดหน้าต่างนัดหมายของสินค้าที่กด
    openBooking(name) {
      this.bookingProduct = String(name);
      this.copied = false;
      this.bookingDialog = true;
    },
    async copyProduct() {
      try {
        await navigator.clipboard.writeText(this.bookingProduct);
        this.copied = true;
      } catch (error) {
        console.error('Copy failed', error);
      }
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
    },
    resetFilters() {
      this.searchName = '';
      this.selectedGroups = [];
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

.booking-product {
  font-size: 1.4rem;
  font-weight: 700;
  word-break: break-word;
}
</style>

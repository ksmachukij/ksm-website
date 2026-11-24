<template>
  <v-container class="product-detail">
    <!-- Back Button -->
    <v-btn
      variant="outlined"
      color="brown"
      class="back-button"
      @click="goBack"
    >
      {{ t('PrdDetails_Back_Btn') }}
    </v-btn>

    <div v-if="product">
      <!-- Product Details -->
      <v-row
        justify="center"
        class="product-main"
      >
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h1 class="product-title">
            {{ product.name }}
          </h1>
          <p class="product-info">
            {{ product.group }}
          </p>
          <p
            v-if="product.countries.length"
            class="product-info"
          >
            {{ countryTitle[languageSystem] }}: {{ countryNames(product.countries) }}
          </p>
          <v-img
            :src="product.image || defaultImage"
            :alt="product.name"
            max-width="800"
            class="product-image"
          />
        </v-col>
      </v-row>

      <!-- Related Products Section -->
      <v-row
        v-if="relatedProducts.length"
        class="related-products"
      >
        <v-col
          cols="12"
          class="related-title"
        >
          <h3>{{ t('PrdDetails_Relate') }} :</h3>
        </v-col>
        <v-col
          v-for="related in relatedProducts"
          :key="related.name"
          cols="6"
          md="3"
          class="related-item"
        >
          <v-card
            class="related-card"
            hover
            :to="{ name: 'ProductDetail', params: { name: related.name } }"
          >
            <v-img
              :src="related.image || defaultImage"
              :alt="related.name"
              height="150"
            />
            <v-card-title class="text-center multi-line">
              {{ related.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- ไม่พบสินค้าตามชื่อใน URL -->
    <div
      v-else
      class="not-found"
    >
      <p>{{ t('PrdDetails_NotFound') }}</p>
    </div>
  </v-container>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { componentText, contentSystem } from '@/assets/static/productlist';
import {
  countryLabel,
  countryTitle,
  productsWithCountry as productList,
} from '@/assets/static/productcountry';
import defaultImagePath from '@/assets/image/IIR.png'; // รูปเริ่มต้นเมื่อสินค้าไม่มีรูป

const TEXTS = [...componentText, ...contentSystem];

export default defineComponent({
  name: 'ProductDetail',
  setup() {
    const store = useStore();
    const languageSystem = computed(() => store.state.config.language);
    return { languageSystem };
  },
  data() {
    return {
      defaultImage: defaultImagePath,
      countryTitle,
    };
  },
  computed: {
    // ชื่อสินค้าจาก URL: /product-detail/:name
    productName() {
      return String(this.$route.params.name ?? '');
    },
    // คำนวณจาก URL โดยตรง จึงอัปเดตเองเมื่อ URL เปลี่ยน ไม่ต้องใช้ watcher/mounted
    product() {
      return productList.find((p) => p.name === this.productName) ?? null;
    },
    // สินค้ากลุ่มเดียวกัน ไม่รวมตัวที่กำลังดูอยู่
    relatedProducts() {
      if (!this.product) return [];
      return productList.filter(
        (p) => p.group === this.product.group && p.name !== this.product.name,
      );
    },
  },
  methods: {
    // ชื่อประเทศตามภาษา ("-" ถ้ายังไม่มีข้อมูล)
    countryName(key) {
      return countryLabel[key]?.[this.languageSystem] ?? '-';
    },
    // หลายประเทศคั่นด้วยจุลภาค
    countryNames(keys) {
      return (keys ?? []).map((key) => this.countryName(key)).join(', ');
    },
    t(name) {
      const row = TEXTS.find((item) => item.Name === name);
      return row?.[this.languageSystem] ?? name;
    },
    // ถ้ามาจากหน้ารายการ ย้อนกลับเพื่อคงตัวกรองเดิมไว้ ไม่งั้นไปหน้ารายการเปล่า
    goBack() {
      const previous = window.history.state?.back;
      if (typeof previous === 'string' && previous.startsWith('/product-list')) {
        this.$router.back();
      } else {
        this.$router.push({ name: 'ProductList' });
      }
    },
  },
});
</script>

<style scoped>
.product-detail {
  background-color: #f8f1e9;
  padding: 20px;
  color: #333;
}

.back-button {
  margin-bottom: 20px;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.product-info {
  margin: 8px 0 0;
  font-size: 1.1rem;
  color: #333;
}

.product-image {
  margin: 20px auto;
}

.related-products {
  margin-top: 40px;
}

.related-title {
  font-weight: bold;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.related-item {
  margin-bottom: 20px;
}

.v-card-title {
  font-size: 1rem;
  padding: 10px 0;
  font-weight: bold;
}

.multi-line {
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
}

.not-found {
  padding: 40px 0;
  text-align: center;
  font-size: 1.1rem;
}
</style>

Vue.config.devtools = true

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `      <div class="product">
        <div class="product-image">
          <img v-bind:src="image">
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <a :href="link" target="_blank">More products like this</a>

          <p v-if="inventory > 10">In Stock</p>
          <p v-else-if="inventory<=10 && inventory > 0">Almost out of Stock</p>
          <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
          <p>Shipping: {{ shipping}}</p>
          <p>{{ sale }}</p>

          <product-details :details="details"></product-details>

          <ul>
            <li v-for="size in sizes">{{ size }}</li>
          </ul>

          <div v-for="(variant, index) in variants"
               :key="variant.variantId"
               class="color-box"
               :style="{ backgroundColor: variant.variantColor }"
               @mouseover="updateProduct(index)">
          </div>

          <button @click="addToCart"
                  :disabled="!inStock"
                  :class="{ disabledButton: !inStock }">Add to Cart</button>
          <button @click="removeFromCart">Remove from Cart</button>

        </div>

      </div>
`,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            inventory: 0,
            onSale: false,
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue.jpg',
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            } else {
                return this.brand + ' ' + this.product + ' are not on sale'
            }
        },
        shipping() {
            if (this.premium) {
                return "free"
            }
            return "$2.99"
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            var index = this.cart.indexOf(id)
            if (index > -1) {
                this.cart.splice(index, 1)
            }
        }
    }
})

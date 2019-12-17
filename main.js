Vue.config.devtools = true

var eventBus = new Vue()

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

          <info-tabs :shipping="shipping" :details="details"></info-tabs>

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

        <product-tabs :reviews="reviews"></product-tabs>

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
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
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
        },
        addReview(productReview) {
            this.reviews.push(productReview)

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
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
          this.reviews.push(productReview)
        })
    }
})

Vue.component('product-tabs', {
    props: {
      reviews: {
        type: Array,
        required: false
      }
    },
    template: `
      <div>

        <div>
          <span class="tabs"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
          >{{ tab }}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="review in reviews">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>

      </div>
    `,
    data() {
      return {
        tabs: ['Reviews', 'Make a Review'],
        selectedTab: 'Reviews'
      }
    }
})

Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">

        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name">
        </p>

        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>

        <p>
          <input type="submit" value="Submit">
        </p>

    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required.")
            }
        }
    }
})

Vue.component('info-tabs', {
    props: {
      shipping: {
        required: true
      },
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <div>

        <ul>
          <span class="tabs"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>

      </div>
    `,
    data() {
      return {
        tabs: ['Shipping', 'Details'],
        selectedTab: 'Shipping'
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

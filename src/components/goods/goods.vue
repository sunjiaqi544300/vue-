<template>
	<div class="goods">	
		<div class="menu-wrapper" v-el:meun-wrapper>
			<ul>
				<li v-for="item in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index,$event)">
					<span class="text">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" v-el:foods-wrapper>
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item">
							<div class="icon">
								<img :src="food.icon"/>
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}分</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">¥<b>{{food.price}}</b></span>
									<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	const ERR_OK = 0;
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0
			};
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
			let foods = [];
			this.goods.forEach((good) => {
				good.foods.forEach((food) => {
					if (food.count) {
						foods.push(food);
					}
				});
			});
			return foods;
		}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				console.log(response);
				if (response.errno === ERR_OK) {
					this.goods = response.data;
//				增加滚动功能
					this.$nextTick(() => {
						this._initScroll();
//				计算滚动的高度
						this.calculateHeight();
					});
				}
			});
		},
		methods: {
//			浏览器与app点击一次单击事件
			selectMenu(index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 300);
				console.log(index);
			},
			_drop(target) {
				// 体验优化，异步执行下落动画
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			},
			_initScroll() {
				this.meunScroll = new BScroll(this.$els.meunWrapper, {
					click: true
				});
				this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			calculateHeight() {
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			}
		},
		components: {
			shopcart,
			cartcontrol
		},
		events: {
			'cart.add'(target) {
				this._drop(target);
			}
		}
	};
</script>
<style lang="stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/icon.styl"	
	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				display: table
				width: 56px
				height: 54px
				line-height: 14px
				padding: 0 12px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background: #fff
					font-weight: 700
					.text
						border-none()
				.icon
					display:inline-block
					vertical-align: top
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
							bg-image('decrease_3')
					&.discount
							bg-image('discount_3')
					&.guarantee
							bg-image('guarantee_3')
					&.invoice
							bg-image('invoice_3')
					&.special
							bg-image('special_3')
				.text
					display: table-cell
					width: 56px
					font-size: 12px
					vertical-align: middle
					border-1px(rgba(7,17,27,0.1))
		.foods-wrapper
			flex: 1
			/*overflow: auto*/ 
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147,153,159)
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px 
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					margin: 2px 0 8px 0
					height: 14px
					line-height: 14px
					font-size: 14px
					.name
						font-size: 14px
						color: rgb(7,17,27)
						line-height: 14px
						margin: 2px 0 8px 0
					.desc
						font-size: 10px
						color: rgb(147,153,159)
						line-height: 12px
						margin-bottom: 8px
					.extra
						font-size: 10px
						line-height: 10px
						.count
							margin-right: 12px
					.price
						color: rgb(147,153,159)
						line-height: 24px
						.now
							font-size: 10px
							margin-right: 8px
							color: rgb(240,20,20)
							b
								font-size: 14px
								font-weight: 700
						.old
							font-size: 10px
							font-weight: 700
							color: rgb(147,153,159)
							text-decoration: line-through
					.cartcontrol-wrapper
						position: absolute		
						right: 0
						bottom: 12px
</style>
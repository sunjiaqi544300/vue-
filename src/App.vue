<template>
	<div>
		<v-header :seller="seller"></v-header>
		<div class="tab">
			<div class="tab-item"><a v-link="{path:'/goods'}">商品</a></div>
			<div class="tab-item"><a v-link="{path:'/ratings'}">评论</a></div>
			<div class="tab-item"><a v-link="{path:'/seller'}">商家</a></div>
		</div>
		<router-view :seller="seller" keep-alive></router-view>
	</div>
</template>
<script type="text/ecmascript-6">
	import {urlParse} from 'common/js/url_localStorage.js';
	import header from './components/header/header.vue';
	const ERR_OK = 0;
	export default {
		data() {
			return {
				seller: {
					id: (() => {
						let queryParam = urlParse();
						console.log(queryParam);
						return queryParam.id;
					})()
				}
			};
		},
		created() {
			this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
//			response = response.json();
				response = response.body;
				console.log(response);
				if (response.errno === ERR_OK) {
//					this.seller = response.data;
					this.seller = Object.assign({}, this.seller, response.data);
//					console.log(this.seller.id);
				}
			});
		},
		components: {
			'v-header': header
		}
	};
</script>
<style lang="stylus">
@import "common/stylus/mixin.styl"
@import "common/stylus/base.styl"
.tab
		display: flex
		width: 100%
		height: 40px
		line-height: 40px
		border-1px(rgba(7,17,27,.1))
.tab-item
	 	flex: 1
	 	text-align: center
a
		display: block
		font-size: 14px
		color: rgb(77,85,93)
.active
		color: rgb(240,20,20)
</style>

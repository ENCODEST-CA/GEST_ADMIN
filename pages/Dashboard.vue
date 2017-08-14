<template lang="pug">
	v-layout(column justify-center align-center class="without-top-margin")
		v-carousel(icon="stop" style="height: 58vh")
			v-carousel-item(
				v-for="(item,i) in items"
				:src="item.src" 
				:key="i" 
			)
		v-container(fluid grid-list-md class="grey lighten-4")
			v-layout(row wrap)
				v-flex(v-bind="{ [`xs${card.flex}`]: true }" v-for="card in cards" :key="card.title")
					v-card
						v-card-media(:class="card.color" height="25vh")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span(class="headline white--text" v-text="card.title")
						v-card-actions
							v-btn(block secondary dark) Ver más
</template>

<script>
	export default {
		data () {
			return {
				items: [
					{ src: 'http://www.businessadministrationinformation.com/wp-content/uploads/2014/07/business-minded.jpg' },
					{ src: 'http://brightfuture.sg/wp-content/uploads/2016/05/upgrade-your-career.jpg' },
					{ src: 'http://www.businessadministrationinformation.com/wp-content/uploads/2014/07/business-minded.jpg' },
					{ src: 'http://brightfuture.sg/wp-content/uploads/2016/05/upgrade-your-career.jpg' }
				],
				cards: [
					{ title: 'Pre-fab homes', color: 'blue', flex: 4 },
					{ title: 'Favorite road trips', color: 'red', flex: 4 },
					{ title: 'Best airlines', color: 'green', flex: 4 }
				]
			}
		}
	}
</script>

<style lang="sass" scoped>
	.fade
		&-enter-active, &-leave-active, &-leave-to
			transition: .3s ease-out
			position: absolute
			top: 0
			left: 0

		&-enter, &-leave, &-leave-to
			opacity: 0
	.without-top-margin
		position:relative !important
		bottom: 48px
</style>
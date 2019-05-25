<template>
  <div class="container">
    <div class="wrapper">
      <swiper  :options="swiperOptions">
        <!-- slides -->
          <swiper-slide v-for="(item, index) in imgs" :key="index">
            <img class="gallary-img" :src="item" >
          </swiper-slide>
        <!-- Optional controls -->
          
      </swiper>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      <div class="swiper-pagination"  slot="pagination"></div>
     
    </div>
    <!-- 按钮层级需高于swiper,会被遮挡,z-index -->
    <div class = "SwiperClose iconfont" @click="handleSwiperClick()">
      &#xe78c;
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonSwiper',
  // props: {
  //   imgs: {
  //     type: Array,
  //     default () {
  //       return []
  //     }
  //   }
  // },
  data () {
    return {
      imgs:['/swiper2.jpg',"/swiper3.jpg",'/swiper4.jpg'],
      swiperOptions: {
        pagination: '.swiper-pagination',
        paginationType: 'fraction',
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
       
        observeParents: true,
        observer: true,
        loop: true, 
      }
    }
  },
  methods: {
    handleSwiperClick() {
      this.$emit('swiper')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .container >>> .swiper-container
    overflow: inherit
  .container
    width: 622px
    height: 380px
    z-index: 300
    background : #1C2630
    position: absolute
    left: 5rem
    top: 3rem
    font-size: 14px
    .wrapper
      width: 100%
      height: 0
      padding-bottom: 61.1%
      overflow:hidden
      .gallary-img
        width: 550px
        height: 303px
        margin-left:36px
        margin-top:37px
        border:2px solid #fff
      .swiper-pagination
        color: #fff
      .swiper-button-prev
        width:29px
        height:20px
      .swiper-button-next
        width:29px
        height:20px
    .SwiperClose
      width:28px
      line-height:28px
      background: #59E1FE
      position:absolute
      top:3px
      right:3px
      z-index:400
      font-size: 18px
      text-align :center
      color:white
      cursor:pointer 
</style>

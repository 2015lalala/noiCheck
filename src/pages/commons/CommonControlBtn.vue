<template>
    <div class="btns">
        <ul>
            <li class="btnOne" v-for = "(item, index) of btnList" :key="index">
                <div class="btnName lf" :class="item.backG">{{item.name}}</div>
                <div class="btn lf" @click="handleBtnclick(index, item.seen )" :class="{onOffActive :  item.seen}">
                    <div class="onOff" :class="{ onOffG :  item.seen }"></div>
                </div>
            </li>
           
        </ul>
    </div>
</template>
<script>
export default {
    name: 'CommonControlBtn',
    data(){
        return{
            isOnOff : false,
            isIndex : -1,
            btnList: [
                {name:'很清新', backG : 'one', seen: false},
                {name:'清新', backG : 'two', seen: false},
                {name:'一般', backG : 'three', seen: false},
                {name:'不清新', backG : 'four', seen: false},
                {name:'未评价', backG : 'five', seen: false}
            ]
        }
    },
    methods: {
       handleBtnclick(index){
          this.btnList[index].seen = !this.btnList[index].seen
          if(this.btnList[index].seen ){
              $('#pupup-all-view').hide()
          }else{
              $('#pupup-all-view').show()
          }
       }
    }
}
</script>
<style lang="stylus" scoped> 
    .btns
        position:absolute
        left:4.26rem
        top:7.96vh
        font-size:.14rem
        color:white
        ul
            li
                margin-bottom:7px
                height: 19px
                .btnName
                    width:58px
                    text-align :center
                    line-height:19px
                .one
                    background: #27CB8F
                .two
                    background: #0BD74E
                .three
                    background: #0D83D6
                .four
                    background: #FF680D
                .five
                    background: #707070
        .btn
            width: 30px
            height: 14px
            background: #59E1FE
            margin-left:10px
            margin-top:2px
            border-top-left-radius:10px    
            border-top-right-radius:10px 
            border-bottom-left-radius:10px
            border-bottom-right-radius:10px
            overflow :hidden
            .onOff
                width:12px
                height: 12px
                float: right
                background: #fff
                margin-top: 1px
                margin-left: 1px
                margin-right: 1px
                border-radius: 50%
        .onOffActive
            background:#707070
            .onOffG
                float:left
</style>



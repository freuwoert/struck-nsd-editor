<template>
    <div class="input">
        <div class="unit" ref="unit" @dragstart.prevent @mousedown="unitMouseDown($event)">&#984085;</div>

        <div class="unit-wheel" @dragstart.prevent v-show="isUnitMouseDown">
            <div class="knob" v-show="unitLen > 30" :style="'transform: rotate('+(-1)*unitDeg+'deg)'"></div>

            <div class="item right"         :class="{'selected': unit_ == 0 && unitLen > 30}">{{units[0].name}}</div>
            <div class="item top-right"     :class="{'selected': unit_ == 1 && unitLen > 30}">{{units[1].name}}</div>
            <div class="item top"           :class="{'selected': unit_ == 2 && unitLen > 30}">{{units[2].name}}</div>
            <div class="item top-left"      :class="{'selected': unit_ == 3 && unitLen > 30}">{{units[3].name}}</div>
            <div class="item left"          :class="{'selected': unit_ == 4 && unitLen > 30}">{{units[4].name}}</div>
            <div class="item bottom-left"   :class="{'selected': unit_ == 5 && unitLen > 30}">{{units[5].name}}</div>
            <div class="item bottom"        :class="{'selected': unit_ == 6 && unitLen > 30}">{{units[6].name}}</div>
            <div class="item bottom-right"  :class="{'selected': unit_ == 7 && unitLen > 30}">{{units[7].name}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            value: {},
        },
        data() {
            return {
                unitFocused: false,
                units: [
                    {name: 'Aufruf', type: 'call'},
                    {name: 'While', type: 'while'},
                    {name: 'Do-While', type: 'do-while'},
                    {name: 'Anweisung', type: 'command'},
                    {name: 'Abfrage', type: 'if'},
                    {name: 'Ausbruch', type: 'break'},
                    {name: 'Endlos', type: 'infinite-loop'},
                    {name: 'Switch', type: 'switch'},
                ],
                unit_: 2,
                isUnitMouseDown: false,
                unitStartX: 0,
                unitStartY: 0,
                unitDeg: 0,
                unitLen: 0,
            }
        },
        mounted() {
            const vm = this

            window.addEventListener('mousemove', function(event) {
                vm.unitMouseMove(event)
            }, false)

            window.addEventListener('mouseup', function(event) {
                vm.unitMouseUp(event)
            }, false)
        },
        methods: {

            unitMouseDown(event) {
                this.isUnitMouseDown = true
                this.unitFocused = true
                
                this.unitStartX = event.clientX - event.offsetX + this.$refs.unit.clientWidth / 2
                this.unitStartY = event.clientY - event.offsetY + this.$refs.unit.clientHeight / 2

                this.unitMouseMove(event)
            },

            unitMouseMove(event) {
                if( this.isUnitMouseDown )
                {
                    let diffX = this.unitStartX - event.clientX
                    let diffY = this.unitStartY - event.clientY
                    let itemDeg = 360 / this.units.length

                    // this is just pythagoras - dont worry
                    this.unitLen = Math.floor(Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2) ))
                    this.unitDeg = Math.floor(Math.atan2(diffY, diffX) / Math.PI * 180) * (-1) + 180

                    this.unitFocused = true

                    if( this.unitLen > 30 )
                    {
                        let deg = this.unitDeg

                        deg += itemDeg / 2
                        if( deg > 360 ) deg -= 360
                        this.unit_ = (deg - deg % itemDeg) / itemDeg
                    }

                }
            },

            unitMouseUp(e) {
                if( this.unitLen > 30 && this.unitFocused)
                {
                    this.$emit('create', this.units[this.unit_].type)
                }

                this.unitFocused = false
                this.isUnitMouseDown = false
            },
        },
    }
</script>
<style lang="sass" scoped>
    .input
        --h: 40px
        --br: 20px
        height: var(--h)
        width: var(--h)
        background: var(--primary)
        border-radius: var(--br)
        position: relative
        text-align: right
        vertical-align: top

        .unit
            width: var(--h)
            line-height: var(--h)
            height: var(--h)
            text-align: center
            font-size: 24px
            font-family: 'Material Icons'
            color: white
            border-radius: var(--br)
            user-select: none
            vertical-align: top
            position: relative
            cursor: pointer

        .unit-wheel
            height: 200px
            width: 200px
            border-radius: 100%
            background: var(--background)
            position: absolute
            top: 50%
            right: 22px
            transform: translate(50%, -50%)
            z-index: 1
            filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.3))
            user-select: none

            &::after
                content: ''
                height: 60px
                width: 60px
                border-radius: 100%
                background: #eee
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)

            .knob
                height: 0
                width: 0
                position: absolute
                z-index: 1
                left: 50%
                top: 50%

                &::after
                    content: ''
                    height: 4px
                    width: 4px
                    border-radius: 2px
                    background: var(--primary)
                    position: absolute
                    top: -2px
                    left: 28px

            .item
                height: 20px
                line-height: 20px
                font-size: 9px
                font-weight: 500
                letter-spacing: 1px
                position: absolute
                z-index: 1
                color: var(--color-bright)
                text-transform: uppercase

                &.selected
                    color: var(--blue)
                    font-size: 11px
                    font-weight: 800

                &.top
                    top: 10px
                    left: 50%
                    transform: translateX(-50%)

                &.top-left
                    top: 29%
                    left: 25%
                    transform: translate(-50%, -50%)

                &.left
                    top: 50%
                    left: 0
                    transform: translateY(-50%)
                    width: 60px
                    text-align: center

                &.bottom-left
                    bottom: 29%
                    left: 25%
                    transform: translate(-50%, 50%)

                &.bottom
                    bottom: 10px
                    left: 50%
                    transform: translateX(-50%)

                &.bottom-right
                    bottom: 29%
                    right: 23%
                    transform: translate(50%, 50%)

                &.right
                    top: 50%
                    right: 0
                    transform: translateY(-50%)
                    width: 60px
                    text-align: center

                &.top-right
                    top: 29%
                    right: 23%
                    transform: translate(50%, -50%)
</style>
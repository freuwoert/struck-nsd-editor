<template>
    <div class="background">
        <div class="container">
            <div class="exit" @click="setExportUI(false)">&#983382;</div>
            <div class="panel">
                <div class="output-container">
                    <div class="output">PNG</div>
                    <div class="output">SVG</div>
                    <div class="output">TEX</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import Spinner from '../components/Spinner.vue'
    import DropDown from '../components/DropDown.vue'
    import { EventBus } from '../../assets/js/event-bus.js'

    export default {
        data() {
            return {
                
            }
        },
        mounted() {
            EventBus.$on('export', () => {
                this.setExportUI(true)
            })
        },
        methods: {
            ...mapActions([
                'setExportUI',
            ]),
        },
        components: {
            Spinner,
            DropDown,
        }
    }
</script>
<style lang="sass" scoped>
    .background
        z-index: 1000
        background: #00000050
        width: 100%
        height: 100%
        position: fixed
        top: 0
        left: 0

        .container
            width: 400px
            height: 600px
            border-radius: 10px
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)
            background: var(--background)
        
            .exit
                height: 30px
                width: 30px
                line-height: 30px
                position: absolute
                top: 5px
                right: 5px
                user-select: none
                border-radius: 40px
                color: var(--color)
                font-size: 20px
                font-family: 'Material Icons'
                cursor: pointer

                &:hover
                    background: var(--color-dimm)
                    color: var(--primary)

            .panel
                position: absolute
                top: 40px
                left: 0
                width: 100%
                height: calc(100% - 40px)
                border-radius: 0 0 10px 10px

                .output-container
                    height: 30px
                    width: calc(100% - 20px)
                    margin: 0 10px
                    background: blue
                    display: flex
                    border-radius: 15px
                    background: var(--background)

                    .output
                        height: 100%
                        flex: 1
                        border-radius: 15px
                        text-align: center
                        color: var(--color)
                        user-select: none
                        cursor: pointer
                        line-height: 30px
                        font-size: 14px
                        font-weight: 700
                        vertical-align: top

                        &:hover
                            background: var(--dark-background)
                            color: var(--primary)
</style>
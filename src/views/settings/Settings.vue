<template>
    <div class="background">
        <div class="container">
            <div class="exit" @click="setSettingsUI(false)">&#983382;</div>
            <div class="panel">
                
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
            EventBus.$on('settings', () => {
                this.setSettingsUI(true)
            })
        },
        methods: {
            ...mapActions([
                'setSettingsUI',
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
</style>
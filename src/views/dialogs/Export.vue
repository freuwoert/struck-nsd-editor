<template>
    <div class="background">
        <div class="container">
            <div class="title">Diagramm exportieren</div>
            <div class="row">
                <div class="name">Format:</div>
                <div class="input-container">
                    <drop-down class="export-method" :options="{'SVG':'SVG','PNG':'PNG','JPG':'JPG','TEX':'TEX'}" v-model="exportMethod"></drop-down>
                </div>
            </div>
            <div class="row">
                <div class="name">Exportieren nach:</div>
                <div class="input-container max-width">
                    <div class="save-path" :title="savePath">{{savePath ? savePath : 'Auswählen'}}</div>
                    <div class="text-button">Ändern</div>
                </div>
            </div>
            <div class="row">
                <div class="ghost-button" @click="setExportUI(false)">Abbrechen</div>
                <div class="button">Exportieren</div>
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
                exportMethod: 'PNG'
            }
        },
        mounted() {
            EventBus.$on('export', () => {
                this.setExportUI(true)
            })
        },
        computed: {
            ...mapGetters([
                'savePath',
            ]),
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
            width: 500px
            border-radius: 10px
            position: absolute
            top: 50%
            left: 50%
            padding: 30px
            padding-bottom: 20px
            text-align: left
            transform: translate(-50%, -50%)
            background: var(--background)

            .title
                width: 100%
                line-height: 20px
                padding-bottom: 5px
                margin-bottom: 20px
                border-bottom: 1px solid var(--color-lighter)
                text-align: left
                font-size: 14px
                font-weight: 800
                letter-spacing: 0.5px
                color: var(--color-bright)
                user-select: none

            .row
                margin: 10px 0
                width: 100%
                text-align: left

                .button
                    float: right

                .ghost-button
                    margin-left: 15px
                    float: right

                .name
                    width: 110px
                    color: var(--color-light)
                    font-size: 11px
                    line-height: 20px
                    padding: 5px 0
                    font-weight: 500
                    vertical-align: top
                    user-select: none

                .input-container
                    vertical-align: top

                    &.max-width
                        width: calc(100% - 110px)

                    .text-button
                        float: right

                    .export-method
                        width: 100px
                        text-align: left
                        background: none

                    .save-path
                        width: 220px
                        font-size: 12px
                        color: var(--color)
                        font-weight: 700
                        line-height: 30px
                        vertical-align: top
                        overflow: hidden
                        text-overflow: ellipsis
                        user-select: none
                        margin-right: 5px
                        padding: 0 10px
</style>
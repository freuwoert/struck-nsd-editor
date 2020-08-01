<template>
    <div class="background">
        <div class="container">
            <div class="title">Einstellungen</div>
            <div class="row">
                <div class="name">Changelog:</div>
                <div class="input-container">
                    <div class="ghost-button" @click="setReleaseNoteUI(true)">Changelog öffnen</div>
                </div>
            </div>
            <div class="row">
                <div class="name">Update:</div>
                <div class="input-container text">{{updateName}}</div>
            </div>
            <div class="row">
                <div class="name">App Version:</div>
                <div class="input-container text">v{{appVersion}}</div>
            </div>
            <div class="row">
                <div class="name">Electron Version:</div>
                <div class="input-container text">v{{electronVersion}}</div>
            </div>
            <div class="row">
                <div class="name">Entwickler:</div>
                <div class="input-container text">Maurice Freuwört</div>
            </div>
            <div class="divider"></div>
            <div class="row">
                <div class="ghost-button last-ghost-button" @click="setSettingsUI(false)">Abbrechen</div>
                <div class="button last-button">Übernehmen</div>
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
        computed: {
            ...mapGetters([
                'updateName',
                'appVersion',
                'electronVersion',
            ]),
        },
        methods: {
            ...mapActions([
                'setSettingsUI',
                'setReleaseNoteUI',
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
        background: #00000070
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

            .divider
                margin: 10px 0 20px
                width: 100%
                border-bottom: 1px solid var(--color-lighter)

            .row
                margin: 10px 0
                width: 100%
                text-align: left
                user-select: none

                .name
                    width: 110px
                    color: var(--color-light)
                    font-size: 11px
                    line-height: 20px
                    padding: 5px 0
                    font-weight: 500
                    vertical-align: top

                .input-container
                    width: calc(100% - 110px)
                    vertical-align: top

                    &.text
                        font-size: 13px
                        line-height: 20px
                        padding: 5px 0
                        font-weight: 800
                        color: var(--color)

                .last-button
                    float: right

                .last-ghost-button
                    margin-left: 15px
                    float: right
</style>
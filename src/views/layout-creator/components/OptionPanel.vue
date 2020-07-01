<template>
    <div class="option-panel">
        <div class="more" @click="toggleMoreMenu()">&#983900;</div>

        <div class="more-menu" v-show="moreMenu">
            <div class="option">
                <div class="text">Neu</div>
                <div class="shortcut">STRG + N</div>
            </div>
            <div class="option">
                <div class="text">Öffnen</div>
                <div class="shortcut">STRG + O</div>
            </div>
            <div class="divider"></div>
            <div class="option">
                <div class="text">Speichern</div>
                <div class="shortcut">STRG + S</div>
            </div>
            <div class="option">
                <div class="text">Speichern als</div>
                <div class="shortcut">STRG + UMSCHALT + S</div>
            </div>
            <div class="divider"></div>
            <div class="option">
                <div class="text">Exportieren</div>
                <div class="shortcut">STRG + E</div>
            </div>
            <div class="option" @click="setSettingsUI(true)">
                <div class="text">Einstellungen</div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        data() {
            return {
                moreMenu: false
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ]),
        },
        methods: {
            ...mapActions([
                'setSettingsUI',
            ]),

            toggleMoreMenu() {
                this.moreMenu = !this.moreMenu
            },
        },
        components: {

        }
    }
</script>
<style lang="sass" scoped>
    .option-panel
        grid-area: option_panel
        background: var(--background)
        position: relative
        text-align: left

        .more
            width: 32px
            height: 32px
            line-height: 32px
            text-align: center
            float: left
            margin: 4px 8px
            color: var(--color)
            font-family: 'Material Icons'
            font-size: 20px
            user-select: none
            cursor: pointer
            border-radius: 40px

            &:hover
                color: var(--color-bright)
                background: var(--color-dimm)

        .more-menu
            position: fixed
            top: 75px
            left: 0px
            width: 300px
            height: calc(100% - 75px)
            background: var(--background)
            border-radius: 0px 7px 0px 0px
            z-index: 2
            margin-bottom: 10px
            padding: 15px 0

            .divider
                width: calc(100% - 30px)
                border-bottom: 1px solid var(--color-lighter)
                margin: 15px

            .option
                width: 100%
                user-select: none
                cursor: pointer
                color: var(--color-bright)

                .text
                    padding: 0 15px
                    height: 36px
                    line-height: 36px
                    font-size: 14px
                    font-weight: 600
                    color: inherit
                    vertical-align: top
                
                .shortcut
                    padding: 0 15px
                    height: 36px
                    line-height: 36px
                    font-size: 11px
                    font-weight: 700
                    color: inherit
                    vertical-align: top
                    float: right
                    color: var(--color-light)

                &:hover
                    color: var(--color-bright)
                    background: var(--color-dimm)
</style>
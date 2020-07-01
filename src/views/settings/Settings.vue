<template>
    <div class="container view">
        <div class="header-panel">
            <div class="exit">
                <div class="esc-button" @click="closeSettings">ESC</div>
            </div>
        </div>
        <div class="menu-panel">
            <div class="menu-container">
                <div class="menu-item">
                    <div class="icon">&#983049;</div>
                    <div class="text">Account</div>
                    <div class="chevron">&#983362;</div>
                </div>
                <div class="menu-item active">
                    <div class="icon">&#984024;</div>
                    <div class="text">Appearance</div>
                    <div class="chevron">&#983362;</div>
                </div>
                <div class="menu-item">
                    <div class="icon">&#987586;</div>
                    <div class="text">Formatting</div>
                    <div class="chevron">&#983362;</div>
                </div>
                <div class="menu-item">
                    <div class="icon">&#983805;</div>
                    <div class="text">Software</div>
                    <div class="chevron">&#983362;</div>
                </div>
            </div>
        </div>
        <div class="content-panel">
            
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import Spinner from '../components/Spinner.vue'
    import DropDown from '../components/DropDown.vue'

    export default {
        data() {
            return {
                
            }
        },
        methods: {
            ...mapActions([
                'setSettingsUI',
            ]),
            closeSettings() {
                this.setSettingsUI(false)
            }
        },
        components: {
            Spinner,
            DropDown,
        }
    }
</script>
<style lang="sass" scoped>
    .container
        z-index: 1000
        background: var(--dark-background)
        grid-template-columns: 300px auto
        grid-template-rows: 40px auto
        grid-template-areas: "header_panel header_panel" "menu_panel content_panel"

        .header-panel
            grid-area: header_panel
            position: relative
            background: var(--background)
        
            .exit
                height: var(--header-height)
                width: 100px
                position: absolute
                top: 40px
                right: 0
                user-select: none
                background: var(--background)
                border-radius: 0 0 0 10px

                &:before
                    content: ''
                    height: var(--header-height)
                    width: 10px
                    border-radius: 0 10px 0 0
                    background: var(--dark-background)
                    position: absolute
                    top: 0
                    left: -10px
                    box-shadow: 0 -10px var(--background)

                .esc-button
                    height: var(--header-height)
                    width: 100%
                    text-align: center
                    line-height: var(--header-height)
                    font-size: 11px
                    font-weight: 800
                    letter-spacing: 1px
                    color: var(--color-light)
                    border-radius: 10px
                    cursor: pointer

                    &:hover
                        background: var(--color-dimm)

        .menu-panel
            grid-area: menu_panel
            position: relative
            user-select: none
            margin-top: 5px
            border-radius: 0 5px 0 0 
            background: var(--background)

            .account-container
                width: 100%
                text-align: center
                margin-top: 20px

                .image
                    height: 130px
                    width: 130px
                    border-radius: 100%
                    border: 5px solid var(--dark-background)
                    display: block
                    margin: 0 auto
                    margin-bottom: 5px

                .name-container
                    width: 100%
                    height: 30px
                    white-space: nowrap
                    overflow: hidden
                    margin-bottom: 20px

                    .name
                        height: 30px
                        line-height: 30px
                        font-size: 16px
                        letter-spacing: 0.5px
                        vertical-align: middle
                    
                    .badge
                        height: 16px
                        line-height: 16px
                        font-size: 10px
                        font-weight: 800
                        letter-spacing: 1px
                        padding: 0 5px
                        border-radius: 4px
                        background: #7158e2
                        margin-left: 5px
                        vertical-align: middle

            .menu-container
                width: 100%

            .logout
                position: absolute
                bottom: 0
                left: 0
            
            .menu-item
                height: 40px
                width: 100%
                text-align: left
                user-select: none
                cursor: pointer
                white-space: nowrap
                border-radius: 5px

                &:hover
                    background: var(--color-dimm)

                .text
                    font-size: 11px
                    letter-spacing: 0.5px
                    font-weight: 800
                    color: var(--color)
                    height: 40px
                    line-height: 40px
                    text-transform: uppercase
                    vertical-align: top

                .icon
                    height: 40px
                    width: 26px
                    line-height: 40px
                    margin: 0 15px
                    font-size: 22px
                    font-family: 'Material Icons'
                    color: var(--color-lighter)
                    vertical-align: top

                    &.red
                        color: var(--red)

                .chevron
                    height: 40px
                    width: 40px
                    text-align: center
                    line-height: 40px
                    font-size: 18px
                    float: right
                    font-family: 'Material Icons'
                    color: var(--color-lighter)
                    vertical-align: top

                &.active
                    .text
                        color: var(--color-bright)
                    .icon
                        color: var(--primary)

        .content-panel
            grid-area: content_panel
            text-align: left
            padding: 80px

            .option
                width: 400px
                border-radius: 10px
                background: var(--background)

                .header
                    width: 100%
                    height: 50px
                    line-height: 50px
                    text-align: center
                    user-select: none
                    
                    .title
                        color: var(--color-bright)
                        font-size: 15px
                        font-weight: 800
                        padding-right: 50px
                        text-transform: uppercase
                        letter-spacing: 1px

                    .spinner
                        float: left
                        margin: 15px

                .option-content
                    width: 100%
                    text-align: left

                    .one-liner
                        width: 100%
                        height: 30px
                        line-height: 30px
                        padding: 0 10px
                        user-select: none

                        .input-element
                            vertical-align: middle
                            float: right
                        .label
                            font-size: 12px
                            letter-spacing: 1px
                            color: var(--color)
                            float: left
                            padding: 0 3px
</style>
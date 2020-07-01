<template>
    <div class="workspace">
        <div class="controls">
            <div class="control-icon-btn">&#984396;</div>
            <div class="control-icon-btn">&#984142;</div>
            <div class="control-icon-btn">&#985722;</div>
            <div class="control-icon-btn">&#984813;</div>
            <div class="control-icon-btn">&#984812;</div>
        </div>

        <div class="center">
            <!-- <colorpicker></colorpicker> -->
            <div class="structure-container">
                <structure v-for="(child, i) in docStructures.children" :key="i" :structure="child"></structure>
                <!--
                <div class="structure if">
                    <div class="content">b == 100</div>
                    <svg class="if-path" preserveAspectRatio="none" viewBox="0 0 400 40">
                        <polyline points="0 0 200 40 400 0"></polyline>
                    </svg>
                    <div class="item-align">
                        <div class="if-container"></div>
                        <div class="if-container">
                            <div class="structure command">
                                <div class="content">a = 650</div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import DragUnit from '../../components/DragUnitInput'
    import StructureInput from '../../components/StructureInput'
    import Colorpicker from '../../components/Colorpicker'
    import Structure from './Structure'

    export default {
        computed: {
            ...mapGetters([
                'docStructures'
            ]),
        },
        methods: {
            ...mapActions([]),
        },
        components: {
            DragUnit,
            Colorpicker,
            Structure,
            StructureInput,
        }
    }
</script>
<style lang="sass" scoped>
    .workspace
        grid-area: workspace
        background: var(--dark-background)
        overflow: hidden
        position: relative

        .controls
            position: absolute
            top: 0
            left: 50%
            transform: translateX(-50%)
            height: 50px
            padding: 10px 7px
            border-radius: 0 0 10px 10px
            background: var(--background)
            user-select: none
            white-space: nowrap

            &:before
                content: ''
                height: 100%
                width: 10px
                border-radius: 0 10px 0 0
                background: var(--dark-background)
                position: absolute
                top: 0
                left: -10px
                box-shadow: 0 -10px var(--background)

            &:after
                content: ''
                height: 100%
                width: 10px
                border-radius: 10px 0 0 0
                background: var(--dark-background)
                position: absolute
                top: 0
                right: -10px
                box-shadow: 0 -10px var(--background)

            .control-icon-btn
                height: 30px
                width: 30px
                line-height: 30px
                border-radius: 30px
                overflow: hidden
                margin: 0 3px
                color: var(--color)
                font-size: 20px
                font-family: 'Material Icons'
                vertical-align: top
                text-align: center
                cursor: pointer

                &:hover
                    background: var(--color-dimm)

                &.active
                    background: var(--dark-background)
                    color: var(--primary)

        .center
            position: absolute
            top: 50px
            left: 0
            width: 100%
            height: calc(100% - 50px)
            padding-top: 50px
            text-align: center
            user-select: none

            .structure-container
                min-width: 300px
                min-height: 60px
                padding: 15px
                border-radius: 7px
                background: var(--background)
                font-family: 'Roboto Mono', monospace
</style>
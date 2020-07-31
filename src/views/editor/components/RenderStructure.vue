<template>
    <div class="structure-rendered">

        <div class="command" v-if="structure.type === 'command'">
            <div class="content">{{structure.content}}</div>
        </div>



        <div class="call" v-if="structure.type === 'call'">
            <div class="content" >{{structure.content}}</div>
        </div>



        <div class="break" v-if="structure.type === 'break'">
            <div class="content">{{structure.content}}</div>

            <svg class="break-path" preserveAspectRatio="none" viewBox="0 0 20 48">
                <polyline stroke="#000" stroke-width="0.7" fill="none" points="20 0 0 24 20 48"></polyline>
            </svg>
        </div>



        <div class="while" v-if="structure.type === 'while'">
            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>

            <div class="loop-container">
                <render-structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></render-structure>
                <div class="placeholder rendered" v-show="structure.children.length == 0"></div>
            </div>
        </div>



        <div class="do-while" v-if="structure.type === 'do-while'">
            <div class="loop-container">
                <render-structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></render-structure>
                <div class="placeholder rendered" v-show="structure.children.length == 0"></div>
            </div>

            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>
        </div>



        <div class="endless-loop" v-if="structure.type === 'endless-loop'">
            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>

            <div class="loop-container">
                <render-structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></render-structure>
                <div class="placeholder rendered" v-show="structure.children.length == 0"></div>
            </div>
        </div>



        <div class="if" v-if="structure.type === 'if'">
            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>

            <div class="condition-container">
                <div class="condition-slot" v-for="(slot, i) in structure.slots" :key="i">
                    <div class="label">{{slot.content}}</div>

                    <render-structure v-for="(child, j) in slot.children" :key="j" :trace="trace+'-'+i+':'+j" :structure="child"></render-structure>
                    <div class="placeholder rendered" v-show="slot.children.length == 0"></div>
                </div>
            </div>

            <!-- <svg class="condition-path" preserveAspectRatio="none" viewBox="0 0 400 40">
                <polyline points="0 0 200 40 400 0"></polyline>
            </svg> -->
        </div>



        <div class="switch" v-if="structure.type === 'switch'">
            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>

            <div class="condition-container">
                <div class="condition-slot" v-for="(slot, i) in structure.slots" :key="i">
                    <div class="label">{{slot.content}}</div>

                    <render-structure v-for="(child, j) in slot.children" :key="j" :trace="trace+'-'+i+':'+j" :structure="child"></render-structure>
                    <div class="placeholder rendered" v-show="slot.children.length == 0"></div>
                </div>
            </div>

            <!-- <svg class="condition-path" preserveAspectRatio="none" viewBox="0 0 400 40">
                <polyline points="0 0 200 40 400 0"></polyline>
            </svg> -->
        </div>
    </div>
</template>

<script>
    import StructureInput from '../../components/StructureInput'
    import { EventBus } from '../../../assets/js/event-bus.js'
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'render-structure',
        props: {
            structure: {
                type: Object,
                required: true
            },
            trace: {}
        },
        components: {
            StructureInput,
        }
    }
</script>

<style lang="sass">

    .structure-rendered
        display: block
        text-align: left
        position: relative
        margin-bottom: -1px
        user-select: none

        .command
            width: 100%
            background: white
            color: black
            padding: 12px 10px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

        .call
            width: 100%
            background: white
            color: black
            padding: 12px 25px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

            &::before
                content: ''
                position: absolute
                left: 18px
                top: -1px
                height: calc(100% + 2px)
                border-right: 1px solid black

            &::after
                content: ''
                position: absolute
                right: 18px
                top: -1px
                height: calc(100% + 2px)
                border-left: 1px solid black

        .break
            width: 100%
            background: white
            color: black
            padding: 12px 25px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

            .break-path
                height: calc(100% + 0px)
                width: 19px
                position: absolute
                top: -0px
                left: -0.8px
                stroke: #000
                stroke-width: 0.7px
                fill: none

        .while
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                padding: 12px 10px
                min-width: 200px
                width: 100%
                text-align: center

            > .loop-container
                display: block
                min-height: 50px
                margin-left: 17px
                position: relative
                margin-top: -1px
                bottom: -1px
                right: -1px
                padding-bottom: 1px
        
        .do-while
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                padding: 12px 10px
                min-width: 200px
                width: 100%
                text-align: center
                margin-top: -1px // Somehow margin-bottom -1px doesnt work on loop-contianer

            > .loop-container
                display: block
                min-height: 50px
                margin-left: 17px
                position: relative
                top: -1px
                right: -1px
                padding-bottom: 1px

        .endless-loop
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative
            padding-bottom: 48px

            > .content-container
                padding: 12px 10px
                min-width: 200px
                width: 100%
                text-align: center

            > .loop-container
                min-height: 50px
                display: block
                margin-left: 17px
                position: relative
                right: -1px
                padding-bottom: 1px

        .if
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                min-height: 25px
                padding: 0px 10px
                min-width: 200px
                width: 100%
                text-align: center
                position: relative
                z-index: 1

            > .condition-path
                height: 47px
                width: 100%
                position: absolute
                top: 0
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none
                pointer-events: none

                polyline
                    fill: white

            > .condition-container
                display: flex
                min-height: 50px
                width: calc(100% + 2px)
                margin: -1px

                .condition-slot
                    flex: 1
                    position: relative
                    padding-bottom: 1px

                    .label
                        line-height: 20px
                        font-size: 14px
                        color: black
                        float: left
                        cursor: text
                        padding: 2px 4px
                        border-radius: 3px

                    &:last-of-type > .label
                        float: right

                    &:not(:last-of-type)
                        margin-right: -1px

        .switch
            width: 100%
            background: white
            color: black
            border: 1px solid black
            position: relative

            > .content-container
                min-height: 25px
                padding: 0px 10px
                min-width: 200px
                width: 100%
                text-align: center
                position: relative
                z-index: 1

            > .condition-path
                height: 47px
                width: 100%
                position: absolute
                top: 0
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none
                pointer-events: none

                polyline
                    fill: white

            > .condition-container
                display: flex
                min-height: 50px
                width: calc(100% + 2px)
                margin: -1px

                .condition-slot
                    flex: 1
                    position: relative
                    padding-bottom: 1px

                    .label
                        line-height: 20px
                        font-size: 14px
                        color: black
                        float: left
                        cursor: text
                        padding: 2px 4px
                        border-radius: 3px

                        &:hover
                            background: #1dd1a199

                    &:last-of-type > .label
                        float: right

                    &:not(:last-of-type)
                        margin-right: -1px

        .command,
        .call,
        .break,
        .while,
        .do-while,
        .endless-loop,
        .switch,
        .if
            .content
                font-size: 15px
                line-height: 20px
                text-align: center
                padding: 2px 4px
</style>
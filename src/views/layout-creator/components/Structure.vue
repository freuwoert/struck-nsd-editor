<template>
    <div class="structure">

        <div class="command" v-if="structure.type === 'command'">
            <div class="content">{{structure.content}}</div>
            <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" class="hitbox"></div>
        </div>

        <div class="call" v-if="structure.type === 'call'">
            <div class="content">{{structure.content}}</div>
            <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" class="hitbox"></div>
        </div>

        <div class="break" v-if="structure.type === 'break'">
            <div class="content">{{structure.content}}</div>

            <svg class="break-path" preserveAspectRatio="none" viewBox="0 0 20 48">
                <polyline points="20 0 0 24 20 48"></polyline>
            </svg>

            <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" class="hitbox"></div>
        </div>

        <div class="while" v-if="structure.type === 'while'">
            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>

            <div class="loop-container">
                <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" class="hitbox hitbox-top"></div>
                <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
                <div class="placeholder" v-show="structure.children.length == 0"></div>
            </div>

            <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" class="hitbox hitbox-bottom"></div>
        </div>

        <div class="do-while" v-if="structure.type === 'do-while'">
            <div class="loop-container">
                <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" class="hitbox hitbox-top"></div>
                <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
                <div class="placeholder" v-show="structure.children.length == 0"></div>
            </div>

            <div class="content-container">
                <div class="content">{{structure.content}}</div>
            </div>

            <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" class="hitbox hitbox-bottom"></div>
        </div>



        <div v-if="structure.type === 'endless-loop'" class="loop-container">
            <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
            <div class="placeholder" v-show="structure.children.length == 0"></div>
        </div>

        <div v-if="structure.type === 'if' || structure.type === 'switch'" class="condition-container">
            <div class="condition-slot" v-for="(slot, i) in structure.slots" :key="i">
                <div class="label">{{slot.content}}</div>

                <structure v-for="(child, j) in slot.children" :key="j" :trace="trace+'-'+i+':'+j" :structure="child"></structure>
                <div class="placeholder" v-show="slot.children == 0"></div>

                <div @dragstart.prevent @mousedown="mouseDown($event, 'into', trace+'-'+i+':N')" class="hitbox slot"></div>
            </div>
        </div>

        <svg class="condition-path" v-if="structure.type === 'if' || structure.type === 'switch'" preserveAspectRatio="none" viewBox="0 0 400 40">
            <polyline points="0 0 200 40 400 0"></polyline>
        </svg>

        <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" v-if="structure.type === 'endless-loop'" class="hitbox endless-loop-top"></div>
        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'endless-loop'" class="hitbox endless-loop-bottom"></div>
    </div>
</template>

<script>
    import StructureInput from '../../components/StructureInput'
    import { EventBus } from '../../../assets/js/event-bus.js'

    export default {
        name: 'structure',
        props: {
            structure: {
                type: Object,
                required: true
            },
            trace: {}
        },
        methods: {
            mouseDown(event, position, trace = this.trace) {
                EventBus.$emit('toggle-create-element', {event, trace, position})
            }
        },
        components: {
            StructureInput,
        }
    }
</script>

<style lang="sass">
    .placeholder
        background-image: url('~@/assets/images/interface/general/line.svg')
        background-size: 20px
        background-position: top center
        height: 50px
        width: 100%
        border: 1px solid black

    .hitbox
        background: #0057ff55
        border-radius: 5px
        width: 0
        height: var(--hh)
        position: absolute
        bottom: calc(var(--hh) / 2 * -1)
        left: 0
        z-index: 10
        opacity: 0
        cursor: pointer
        display: block

        &:hover
            opacity: 1

        &.first
            height: var(--hh)
            left: 15px
            top: 0
            width: calc(100% - 30px)

    .structure
        display: block
        text-align: left
        position: relative
        margin-bottom: -1px

        .command
            width: 100%
            background: white
            color: black
            padding: 12px 10px
            min-width: 200px
            text-align: center
            border: 1px solid black
            position: relative

            .hitbox
                width: 100%

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
                left: 19px
                top: -1px
                height: calc(100% + 2px)
                border-right: 1px solid black

            &::after
                content: ''
                position: absolute
                right: 19px
                top: -1px
                height: calc(100% + 2px)
                border-left: 1px solid black

            .hitbox
                width: 100%

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
                height: calc(100% + 2px)
                width: 20px
                position: absolute
                top: -1px
                left: -0.5px
                stroke: #000
                stroke-width: 0.8px
                fill: none

            .hitbox
                width: 100%

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
                min-height: 50px
                width: calc(100% - 17px)
                margin-left: 17px
                position: relative
                bottom: -1px
                right: -1px

                > .hitbox-top
                    top: -15px
                    width: 100%

            > .hitbox-bottom
                width: 18px
        
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

            > .loop-container
                min-height: 50px
                width: calc(100% - 17px)
                margin-left: 17px
                position: relative
                top: -1px
                right: -1px

                > .hitbox-top
                    top: 0px
                    width: 100%
                    height: 20px

            > .hitbox-bottom
                width: 100%

        .command,
        .call,
        .break,
        .while,
        .do-while
            .content
                font-size: 15px
                line-height: 20px
                text-align: center
                cursor: text
                padding: 2px
                border-radius: 2px

                &:hover
                    background: #0057ff55

        .condition-container
            display: flex
            min-height: var(--eh)
            width: 100%
            margin-right: -1px
            margin-bottom: -1px
            margin-top: -40px

            .condition-slot
                min-width: 100px
                min-height: var(--eh)
                margin-right: -1px
                position: relative

                .label
                    height: 40px
                    padding-top: 20px
                    line-height: 20px
                    padding-left: 5px
                    width: 100%
                    font-size: 14px
                    color: black
                    text-align: left
                    border-right: 1px solid black

                &:first-of-type
                    margin-left: -1px

                &:last-of-type > .label
                    text-align: right
                    padding-right: 5px

        &.if > .content
            position: relative
            z-index: 1
            padding: 2px 10px

        &.switch > .content
            position: relative
            z-index: 1
            padding: 2px 10px

        &.if, &.switch
            .condition-path
                height: var(--eh)
                width: 100%
                position: absolute
                top: 0
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none

                polyline
                    fill: white

        &.endless-loop
            padding-bottom: calc(var(--eh) - 1px)
</style>
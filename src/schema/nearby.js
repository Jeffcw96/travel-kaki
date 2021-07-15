import { PlaceTypes, INPUT, DROPDOWN, SLIDER, Kilometer } from '@/enum/common'
import AddressInput from '@/components/AddressInput'
import Slider from '@/components/Slider'
import Dropdown from '@/components/Dropdown'
import TextBox from '@/components/TextBox'
import { string, number } from '@/validations/common'

export default {
    original_location: {
        component: AddressInput,
        label: "From",
        placeholderLabel: 'Origin',
        refLabel: "origin",
        type: INPUT,
        allowNearBy: true,
        cssClass: ['px-10', 'py-10', 'w-250', 'border-standard', 'd-block', 'border-right-0'],
        parentClass: ['text-left', 'font-white', 'position-relative'],
        validations: []
    },
    type: {
        component: Dropdown,
        label: "Type",
        refLabel: "type",
        type: DROPDOWN,
        cssClass: ['px-10', 'py-10', 'w-200', 'border-standard', 'border-right-0', 'd-block'],
        parentClass: ['text-left', 'font-white'],
        suggestions: function () {
            return PlaceTypes
        },
        validations: []
    },
    rating: {
        component: TextBox,
        label: "Rating",
        refLabel: "rating",
        placeholderLabel: 'eg: 4.5',
        type: DROPDOWN,
        cssClass: ['px-10', 'py-10', 'w-200', 'border-standard', 'd-block'],
        parentClass: ['text-left', 'font-white'],
        onlyNumber: true,
        decimalPlaces: 2,
        min: 1,
        max: 5,
        numberFormat: [],
        validations: [number.range(1, 5)]
    },
    radius: {
        component: Slider,
        label: "Radius",
        refLabel: "radius",
        type: SLIDER,
        unit: Kilometer,
        defaultValue: 1000,
        min: 0,
        max: 10,
        cssClass: ['d-block', 'my-10'],
        parentClass: ['text-left', 'font-white', 'p-5'],
        validations: []
    }
}
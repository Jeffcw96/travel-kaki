import { PlaceTypes, INPUT, DROPDOWN } from '@/enum/common'
import AddressInput from '@/components/AddressInput'
import Dropdown from '@/components/Dropdown'
import TextBox from '@/components/TextBox'
import { string } from '@/validations/common'

export default {
    original_location: {
        component: AddressInput,
        label: "From",
        placeholderLabel: 'Origin',
        refLabel: "origin",
        type: INPUT,
        cssClass: ['px-10', 'py-10', 'w-250', 'border-standard', 'd-block', 'border-right-0'],
        parentClass: ['text-left', 'font-white'],
        validations: []
    },
    destination_location: {
        component: AddressInput,
        label: "To",
        placeholderLabel: 'Destination',
        refLabel: "destination",
        type: INPUT,
        cssClass: ['px-10', 'py-10', 'w-250', 'border-standard', 'd-block', 'border-right-0'],
        parentClass: ['text-left', 'font-white'],
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
        decimalPlaces: 1,
        numberFormat: [],
        validations: [string.isRequired]
    }
}
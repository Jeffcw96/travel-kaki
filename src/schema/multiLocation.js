import { PlaceTypes } from '@/enum/common'
import AddressInput from '@/components/AddressInput'
import Dropdown from '@/components/Dropdown'
console.log('PlaceTypes', PlaceTypes)
export default {
    original_location: {
        component: AddressInput,
        label: "From",
        placeholderLabel: 'Origin',
        refLabel: "origin",
        cssClass: ['px-10', 'py-10', 'w-250', 'border-standard', 'd-block', 'border-right-0'],
        parentClass: ['text-left', 'font-white']
    },
    destination_location: {
        component: AddressInput,
        label: "To",
        placeholderLabel: 'Destination',
        refLabel: "destination",
        cssClass: ['px-10', 'py-10', 'w-250', 'border-standard', 'd-block'],
        parentClass: ['text-left', 'font-white']
    },
    type: {
        component: Dropdown,
        label: "Type",
        refLabel: "type",
        cssClass: ['px-10', 'py-10', 'w-250', 'border-standard', 'd-block'],
        parentClass: ['text-left', 'font-white'],
        suggestions: function () {
            return PlaceTypes
        }
    }
}
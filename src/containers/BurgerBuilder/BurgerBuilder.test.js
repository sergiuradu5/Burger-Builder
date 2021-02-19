import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {shallow, mount} from 'enzyme';
import Enzyme from 'enzyme';

import {BurgerBuilder} from './BurgerBuilder';
import {BuildControls} from '../../components/Burger/BuildControls/BuildControls';

Enzyme.configure({adapter: new Adapter()});

describe('<BurgerBuilder />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}
        onFetchIngredientPrices={() => {}}
        />);
    });

    it ('should render <BuildControls/> when receiving ingredients', () => {
        wrapper.setProps({ings: {salad: 0}});
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    });

});
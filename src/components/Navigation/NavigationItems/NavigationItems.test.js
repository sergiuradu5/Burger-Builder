import React from 'react';
//enzyme
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {shallow, mount} from 'enzyme';
import Enzyme from 'enzyme';

//Mock store for Redux
import {Provider} from "react-redux";
import configureMockStore from 'redux-mock-store';

//reducers
import authReducer from '../../../store/reducers/auth';
import orderReducer from '../../../store/reducers/order';
import burgerBuilderReducer from '../../../store/reducers/burgerBuilder';
import {createStore, combineReducers} from 'redux';

//Components that we want to test on
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

//configuring a redux mock store
const mockStore = configureMockStore();
// const store = mockStore({
//     token: null,
// });

//Trying to create a new store with proper reducers
const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderReducer,
    auth: authReducer,
    order: orderReducer
});

const store = createStore(rootReducer);

Enzyme.configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = shallow(
            <Provider store={store}>
                <NavigationItems />
            </Provider>
            );
    })

    it('should  render 2 <NavigationItem /> elements if not authenticated', () => {
        
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should  render 3 <NavigationItem /> elements if authenticated', () => {
        wrapper.setProps({isauthenticated: true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it('should  render a <NavigationItem>Logout</NavigationItem> element if authenticated', () => {
        wrapper.setProps({isauthenticated: true});
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    });
});
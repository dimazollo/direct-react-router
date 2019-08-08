import React from 'react';

import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';

import { AdvancedLink, RouterConfig, RouterContext } from '../../src';

const mockStore = configureMockStore();
const config: RouterConfig = {
    routes: {
        PAGE1: '/p1',
        PAGE2: '/p2/:login/count/:num'
    }
};

function render2(node: React.ReactNode) {
    const store = mockStore();
    const link = mount(<Provider store={store}>{node}</Provider>);

    return { link, store };
}

describe('AdvancedLink', () => {

    it('generate proper url by props', () => {
        const { link } = render2(
            <RouterContext.Provider value={{ config }}>
                <AdvancedLink 
                    routeKey='PAGE2'
                    params={{ login: 'test', num: '12' }}
                    query={{ aa: '1', bb: '2' }}
                    hash='#xxx'
                >test</AdvancedLink>
            </RouterContext.Provider>
        );

        expect(link.getDOMNode().getAttribute('href')).is.eq('/p2/test/count/12?aa=1&bb=2#xxx');
    });

    it('generate proper url with basename', () => {
        const { link } = render2(
            <RouterContext.Provider value={{ config, basename: 'fff' }}>
                <AdvancedLink 
                    routeKey='PAGE2'
                    params={{ login: 'xxx', num: '00' }}
                    query={{ aa: '3', bb: '4' }}
                    hash='#xxx'
                >test</AdvancedLink>
            </RouterContext.Provider>
        );

        expect(link.getDOMNode().getAttribute('href')).is.eq('/fff/p2/xxx/count/00?aa=3&bb=4#xxx');
    });

    it('throw error when no config', () => {
        expect(() => {
            render2(<AdvancedLink routeKey='PAGE1'>test</AdvancedLink>);
        }).throws('Routes configuration is not specified');
    });
});
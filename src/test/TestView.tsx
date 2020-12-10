import React, { Component, createRef, RefObject } from 'react';
import { Text, View, ScrollView, Dimensions, ScaledSize, LayoutChangeEvent } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from '@/components/thirdparty/recyclerlistview/src';
import { ScrollEvent } from '@/components/thirdparty/recyclerlistview/src/core/scrollcomponent/BaseScrollView';

/**
 * 生成数据
 *
 * @return {*} 数据
 */
function generateData(): Array<any> {
    const array = [];
    for (let i = 0; i < 10000; i++) {
        const row: { [index: string]: string } = {
            id: i.toString(),
            name: `name${i}`,
        };

        for (let j = 0; j < 30; j++) {
            row[`data${j}`] = `value${j}`;
        }

        array.push(row);
    }

    return array;
}

export default class TestView extends Component {
    stickyColumnsView: RefObject<any> = createRef();
    contentView: RefObject<any> = createRef();
    size: ScaledSize = Dimensions.get('window');
    dataProvider: DataProvider = new DataProvider((r1, r2) => r1 !== r2);
    scrollLocker: boolean = false;

    state = {
        dataProvider: this.dataProvider.cloneWithRows(generateData()),
    };

    protected render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>TestView</Text>
                <ScrollView style={{ flex: 1 }} horizontal>
                    <RecyclerListView ref={this.stickyColumnsView} style={{ width: 120 }} isHorizontal={false} layoutProvider={this._stickyColumnsLayoutProvider()} dataProvider={this.state.dataProvider} rowRenderer={this._stickyColumnsRowRenderer} onScroll={(event: ScrollEvent) => this._onScroll(this.stickyColumnsView, event)} />
                    <RecyclerListView ref={this.contentView} style={{ width: 3000 }} isHorizontal={false} layoutProvider={this._layoutProvider()} dataProvider={this.state.dataProvider} rowRenderer={this._rowRenderer} onScroll={(event: ScrollEvent) => this._onScroll(this.contentView, event)} />
                </ScrollView>
            </View>
        );
    }

    private _layoutProvider(): LayoutProvider {
        return new LayoutProvider(
            () => 0,
            (_type, dim) => {
                dim.width = 3000;
                dim.height = 100;
            }
        );
    }

    private _rowRenderer(type: string | number, data: any, index: number) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', position: 'relative' }}>
                {Object.values(data).map((item: any, i: number) => (
                    <View key={`view${index}-${i}`}>
                        <Text key={`cell${index}-${i}`} style={{ width: 120 }}>
                            {item}
                        </Text>
                    </View>
                ))}
            </View>
        );
    }

    private _stickyColumnsLayoutProvider(): LayoutProvider {
        return new LayoutProvider(
            () => 0,
            (_type, dim) => {
                dim.width = 3000;
                dim.height = 100;
            }
        );
    }

    private _stickyColumnsRowRenderer(type: string | number, data: any, index: number) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <View key={`view${index}-0`} style={{ width: 120, height: 100 }}>
                    <Text key={`cell${index}-0`}>sticky</Text>
                </View>
            </View>
        );
    }

    private _onScroll(sender: RefObject<any>, event: ScrollEvent) {
        if (this.scrollLocker) {
            return;
        }

        this.scrollLocker = true;

        const y = event.nativeEvent.contentOffset.y;
        if (sender !== this.stickyColumnsView) {
            this.stickyColumnsView.current.scrollTo({ y: y });
        }
        if (sender !== this.contentView) {
            this.contentView.current.scrollTo({ y: y });
        }

        this.scrollLocker = false;
    }
}

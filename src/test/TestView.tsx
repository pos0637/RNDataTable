import React, { Component } from 'react';
import { Text, View, Dimensions, ScaledSize } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from '@/components/thirdparty/recyclerlistview/src';

/**
 * 生成数据
 *
 * @return {*} 数据
 */
function generateData(): Array<any> {
    const array = [];
    for (let i = 0; i < 100; i++) {
        const row: { [index: string]: string } = {
            id: i.toString(),
            name: `name${i}`,
        };

        for (let j = 0; j < 20; j++) {
            row[`data${j}`] = `value${j}`;
        }

        array.push(row);
    }

    return array;
}

export default class TestView extends Component {
    size: ScaledSize = Dimensions.get('window');

    dataProvider: DataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    state = {
        dataProvider: this.dataProvider.cloneWithRows(generateData()),
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>TestView</Text>
                <RecyclerListView style={{ width: 3000 }} isHorizontal={false} layoutProvider={this._layoutProvider()} dataProvider={this.state.dataProvider} rowRenderer={this._rowRenderer} />
            </View>
        );
    }

    _layoutProvider(): LayoutProvider {
        return new LayoutProvider(
            () => 0,
            (_type, dim) => {
                dim.width = 3000;
                dim.height = 100;
            }
        );
    }

    _rowRenderer(type: string | number, data: any, index: number) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {Object.values(data).map((item: any, index: number) => (
                    <Text key={`cell${index}`} style={{ width: 120 }}>{item}</Text>
                ))}
            </View>
        );
    }
}

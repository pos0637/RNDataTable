import React, { Component, createRef, RefObject, useState } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from '@/components/thirdparty/recyclerlistview/src';
import { ScrollEvent } from '@/components/thirdparty/recyclerlistview/src/core/scrollcomponent/BaseScrollView';
import BindingData from '@/miscs/bindingData';

/**
 * 生成数据
 *
 * @param {number} count 数量
 * @return {*}  {Array<any>} 数据
 */
function generateData(count: number): Array<any> {
    const array = [];
    for (let i = 0; i < count; i++) {
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

const FooterView = (props: { vmodel: BindingData }) => {
    const [value, setValue] = useState(props.vmodel.bind('value', (_val: String, newVal: String) => setValue(newVal)));
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center' }}>{value}</Text>
        </View>
    );
};

export default class TestView extends Component {
    private headerView: RefObject<any> = createRef();
    private contentView: RefObject<any> = createRef();
    private dataProvider: DataProvider = new DataProvider((r1, r2) => r1 !== r2);
    private footer = new BindingData({ value: 'Loading...' });

    state = {
        dataProvider: this.dataProvider.cloneWithRows(generateData(20)),
        loading: false,
    };

    public render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>TestView</Text>
                <View style={{ flexDirection: 'row', width: '100%', height: 40 }}>
                    <View style={{ width: 120, height: 40 }}>
                        <Text>sticky header</Text>
                    </View>
                    <ScrollView ref={this.headerView} horizontal>
                        <View style={{ width: 3000, height: 40 }}>
                            <Text>header</Text>
                        </View>
                    </ScrollView>
                </View>
                <RecyclerListView
                    ref={this.contentView}
                    isHorizontal={false}
                    stickyColumnsWidth={120}
                    contentColumnsWidth={3000}
                    layoutProvider={this._layoutProvider()}
                    dataProvider={this.state.dataProvider}
                    onContentViewScroll={(event) => this._onScroll(event)}
                    onEndReachedThreshold={100 * 3}
                    onEndReached={() => this._onEndReached()}
                    renderFooter={() => this._renderFooter()}
                    rowRenderer={this._rowRenderer}
                    stickyColumnsRowRenderer={this._stickyColumnsRowRenderer}
                    scrollViewProps={{
                        refreshControl: (
                            <RefreshControl
                                refreshing={this.state.loading}
                                onRefresh={async () => {
                                    this.setState({ loading: true });
                                    setTimeout(() => {
                                        this.setState({ dataProvider: this.dataProvider.cloneWithRows(generateData(20)) });
                                        this.setState({ loading: false });
                                    }, 1000);
                                }}
                            />
                        ),
                    }}
                />
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

    private _onEndReached(): void {
        console.debug('onEndReached');
        setTimeout(() => {
            if (this.state.dataProvider.getSize() < 100) {
                this.setState({ dataProvider: this.dataProvider.cloneWithRows(generateData(this.state.dataProvider.getSize() + 20)) });
            } else {
                this.footer.setData('value', 'no more data');
            }
        }, 1000);
    }

    private _renderFooter() {
        return <FooterView vmodel={this.footer} />;
    }

    private _rowRenderer(type: string | number, data: any, index: number) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: 3000 }}>
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

    private _stickyColumnsRowRenderer(type: string | number, data: any, index: number) {
        return (
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <View key={`view${index}-0`} style={{ width: 120, height: 100 }}>
                    <Text key={`cell${index}-0`}>sticky</Text>
                </View>
            </View>
        );
    }

    private _onScroll(event: ScrollEvent) {
        const x = event.nativeEvent.contentOffset.x;
        this.headerView.current.scrollTo({ x: x, y: 0 });
    }
}

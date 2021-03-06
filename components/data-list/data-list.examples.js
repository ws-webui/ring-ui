/* @flow */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/sort-comp */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import DataList from './data-list';
import Selection from './selection';
import mock, {moreItems} from './data-list.mock';

import {moreLessButtonStates} from './item';

class DataListDemo extends PureComponent {
  expandedItems = new Set();
  isItemCollapsible = item => item.collapsible && item.items && item.id > 10;
  isItemCollapsed = item => !this.expandedItems.has(item.id);

  state = {
    data: mock,
    selection: new Selection({
      data: mock,
      isItemSelectable: item => item.selectable,
      getChildren: item => {
        const collapsible = this.isItemCollapsible(item);
        const collapsed = this.isItemCollapsed(item);
        return ((collapsible && collapsed) || !item.items) ? [] : item.items;
      }
    })
  };

  moreExpandebleItems = new Set([mock[0].id]);
  moreExpandedItems = new Set();

  itemMoreLessState = item => {
    if (this.moreExpandebleItems.has(item.id)) {
      return this.moreExpandedItems.has(item.id)
        ? moreLessButtonStates.LESS
        : moreLessButtonStates.MORE;
    } else {
      return moreLessButtonStates.UNUSED;
    }
  };

  onItemMoreLess = (item, more) => {
    if (more) {
      this.moreExpandedItems.add(item.id);
      item.items = item.items.concat([...moreItems]);
    } else {
      this.moreExpandedItems.delete(item.id);
      item.items = item.items.slice(0, item.items.length - moreItems.length);
    }

    this.setState({data: [...this.state.data]});
  };

  onSelect = selection => {
    this.setState({selection});
  };

  itemFormatter = item => {
    const collapsible = this.isItemCollapsible(item);
    const collapsed = this.isItemCollapsed(item);

    const onCollapse = () => {
      this.expandedItems.delete(item.id);
      this.setState({data: [...this.state.data]});
    };

    const onExpand = () => {
      this.expandedItems.add(item.id);
      this.setState({data: [...this.state.data]});
    };

    return {
      ...item,
      collapsible,
      collapsed,
      onCollapse,
      onExpand
    };
  };

  render() {
    return (
      <DataList
        data={this.state.data}
        selection={this.state.selection}
        onSelect={this.onSelect}

        itemFormatter={this.itemFormatter}

        onItemMoreLess={this.onItemMoreLess}
        itemMoreLessState={this.itemMoreLessState}
      />
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo/>, container);

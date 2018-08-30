import '../../spec_helper';
import {Table, withCellTooltip} from '../../../../src/react/table';

describe('withCellTooltip', () => {
  let tooltip, data, subject;

  beforeEach(() => {
    tooltip = jest.fn().mockName('tooltip').mockImplementation(({isHeader}) => {
      return {
        text: `is header? ${isHeader}`,
        size: isHeader ? 'md' : undefined,
        theme: isHeader ? 'light' : 'dark',
        showIcon: isHeader
      };
    });
    const columns = [{
      attribute: 'attr1', tooltip
    }, {
      attribute: 'attr2', displayName: 'Display2'
    }];
    data = [{
      attr1: 'row1-value1', attr2: 'row1-value2'
    }, {
      attr1: 'row2-value1', attr2: 'row2-value2'
    }];

    const ComposedTable = withCellTooltip(Table);
    subject = shallow(<ComposedTable {...{columns, data}}/>);
  });

  it('calls tooltip callback for header and body cells', () => {
    expect(tooltip).toHaveBeenCalledWith({isHeader: true}, undefined);
    expect(tooltip).toHaveBeenCalledWith({isHeader: false}, data[0]);
    expect(tooltip).toHaveBeenCalledWith({isHeader: false}, data[1]);
  });

  it('renders a hidden tooltip', () => {
    expect(
      subject.find('thead tr').at(0).find('th').at(0).find('.tooltip .tooltip-container').hasClass('tooltip-container-hidden')
    ).toBeTruthy();
    expect(
      subject.find('tbody tr').at(0).find('td').at(0).find('.tooltip .tooltip-container').hasClass('tooltip-container-hidden')
    ).toBeTruthy();
    expect(
      subject.find('tbody tr').at(1).find('td').at(0).find('.tooltip .tooltip-container').hasClass('tooltip-container-hidden')
    ).toBeTruthy();
  });

  it('renders an Icon for the first header', () => {
    expect(subject.find('th').at(0).find('svg').hasClass('icon-info_outline')).toBeTruthy();
  });

  it('does not render an Icon for the second header or any body cells', () => {
    expect(subject.find('th').at(1).find('svg').exists()).toBeFalsy();
    expect(subject.find('tr').at(1).find('td').at(0).find('svg').exists()).toBeFalsy();
    expect(subject.find('tr').at(2).find('td').at(1).find('svg').exists()).toBeFalsy();
    expect(subject.find('tr').at(3).find('td').at(0).find('svg').exists()).toBeFalsy();
    expect(subject.find('tr').at(4).find('td').at(1).find('svg').exists()).toBeFalsy();
  });

  describe('when hovering the first header', () => {
    beforeEach(() => {
      subject.find('tr').at(0).find('th').at(0).find('.tooltip').simulate('mouseOver');
    });

    afterEach(() => {
      subject.find('tr').at(0).find('th').at(0).find('.tooltip').simulate('mouseOut');
    });

    it('renders a tooltip', () => {
      expect(
        subject.find('thead th').at(0).find('.tooltip .tooltip-container').hasClass('tooltip-container-visible')
      ).toBeTruthy();
      expect(subject.find('thead th').at(0).find('.tooltip-content').text()).toBe('is header? true');
    });
  });

  describe('when hovering the first body row first column', () => {
    beforeEach(() => {
      subject.find('tr').at(1).find('td').at(0).find('.tooltip').simulate('mouseOver');
    });

    afterEach(() => {
      subject.find('tr').at(1).find('td').at(0).find('.tooltip').simulate('mouseOut');
    });

    it('renders a tooltip', () => {
      expect(subject.find('tr').at(1).find('td').at(0).find('.tooltip-content').text()).toBe('is header? false');
    });
  });
});
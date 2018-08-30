import '../../spec_helper';
import {Table, withCellEllipsis} from '../../../../src/react/table';

describe('withCellEllipsis', () => {
  let data, columns, ComposedTable, subject;

  beforeEach(() => {
    columns = [{attribute: 'attr1'}];
    data = [{attr1: 'my value'}];
    ComposedTable = withCellEllipsis(Table);
  });

  describe('when ellipsis is true', () => {
    beforeEach(() => {
      columns[0].ellipsis = true;
      subject = shallow(<ComposedTable {...{columns, data}}/>);
    });

    it('renders with the "type-ellipsis" class', () => {
      expect(subject.find('table tr').at(1).find('td').at(0).find('span').hasClass('type-ellipsis')).toBeTruthy();
    });
  });

  describe('when ellipsis is false', () => {
    beforeEach(() => {
      columns[0].ellipsis = false;
      subject = shallow(<ComposedTable {...{columns, data}}/>);
    });

    it('does not render with the "type-ellipsis" class', () => {
      expect(subject.find('table tr').at(1).find('td').at(0).find('span').exists()).toBeFalsy();
    });
  });
});

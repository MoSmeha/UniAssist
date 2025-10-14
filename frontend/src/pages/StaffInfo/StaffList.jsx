import { memo } from 'react';
import TopBar from "./TopSearchBar";
import AllStaff from "./AllStaff";
import useStaffStore from '../../zustand/useStaffStore';

function StaffList() {
  const { setSearchTerm } = useStaffStore();

  return (
    <>
      <TopBar setSearchTerm={setSearchTerm} />
      <AllStaff />
    </>
  );
}
export default memo(StaffList);
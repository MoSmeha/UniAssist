import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import { Box, Pagination } from "@mui/material";

import { memo } from 'react';

const PaginationControls = memo(() => {
  const { pagination, setPage } = useLostAndFoundStore();

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Pagination
        count={pagination.totalPages}
        page={pagination.page}
        onChange={handleChange}
        color="primary"
      />
    </Box>
  );
});

export default PaginationControls;

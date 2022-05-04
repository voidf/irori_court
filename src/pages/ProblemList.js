import axios from 'axios';

import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// material
import {
  Box,
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPage from '@mui/icons-material/LastPage';

import { useTheme } from '@mui/material/styles';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { ProblemListHead, ProblemListToolbar, ProblemMoreMenu } from '../sections/@dashboard/problem';
// mock
import USERLIST from '../_mock/user';
import LOCALIZATIONPACK from '../localization/str';
import U from '../api/urls';
// ----------------------------------------------------------------------
axios.defaults.withCredentials = true;
const problemstring = LOCALIZATIONPACK.problem;

const TABLE_HEAD = [
  { id: 'status', label: problemstring.status, alignRight: false },
  { id: 'pk', label: problemstring.code, alignRight: false },
  { id: 'title', label: problemstring.title, alignRight: false },
  { id: 'tags', label: problemstring.tags, alignRight: false },
  { id: 'difficulty', label: problemstring.difficulty, alignRight: false },
  { id: 'accuracy', label: problemstring.accuracy, alignRight: false },
  // { id: 'submitted', label: problemstring.submitted, alignRight: false },
  // { id: 'solved', label: problemstring.solved, alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  console.log(array);
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const handleSetPage = (event) => {
    onPageChange(event,
      Math.max(0,
        Math.min(
          Math.ceil(count / rowsPerPage) - 1,
          parseInt(prompt(`${problemstring.setPageHint}(1~${Math.ceil(count / rowsPerPage) - 1})`), 10) - 1
        )))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <Button
        color="inherit"
        onClick={handleSetPage}
        endIcon={<Iconify icon={'eva:color-picker-outline'} />}
      >
        {problemstring.page}
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {page + 1}
        </Typography>
      </Button>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function ProblemList() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [shouldRequest, setShouldRequest] = useState(true);

  const [problemList, setProblemList] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [totalProblems, setTotalProblems] = useState(0);

  const getProblems = () => {
    if (shouldRequest) {
      setShouldRequest(false);
      axios.get(U(`/problem?page=${page + 1}&perpage=${rowsPerPage}`)).then(resp => {
        console.log(resp);
        setProblemList(resp.data.data);
        setTotalProblems(resp.data.total);
        // setRowsPerPage(resp.data.perpage);
        console.log(problemList, rowsPerPage, totalProblems);
      }).catch(reason => {
        console.log(reason);
      });
    }
  };

  const refreshProblems = () => {
    setShouldRequest(true);
    getProblems();
  };

  useEffect(getProblems);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event, newPage) => {
    // const x = rowsPerPage;
    // setRowsPerPage(0);
    setPage(newPage);
    // setRowsPerPage(x);
    refreshProblems();
    // setRowsPerPage(x);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    refreshProblems();
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, rowsPerPage - problemList.length) : 0;

  const filteredProblems = applySortFilter(problemList, getComparator(order, orderBy), filterName);

  const isProblemNotFound = filteredProblems.length === 0;

  return (
    <Page title={LOCALIZATIONPACK.nav.problem}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {LOCALIZATIONPACK.nav.problem}
          </Typography>
        </Stack>

        <Card>
          <ProblemListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProblemListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={problemList.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredProblems
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { pk, title, tags, difficulty, submitted, solved } = row;

                      return (
                        <TableRow
                          hover
                          style={{cursor:"pointer"}}
                          key={pk}
                          tabIndex={-1}
                          role="checkbox"
                          onClick={() => navigate(`/dashboard/problem/${pk}`, { replace: false })}
                        >
                          <TableCell align="left">
                            {/* <Iconify icon="mdi:check" sx={{ color: 'text.disabled', width: 20, height: 20 }} /> */}
                            <Iconify icon="mdi:window-minimize" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none" align="left">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {pk}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{title}</TableCell>
                          <TableCell align="left">{tags}</TableCell>
                          <TableCell align="left">{difficulty}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={'success'}>
                              {
                                /* {sentenceCase(status)} */
                                solved === 0 ? 0 : solved * 100.0 / submitted
                              }%

                          </Label>
                          </TableCell>

                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isProblemNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalProblems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />

        </Card>
      </Container>
    </Page>
  );
}

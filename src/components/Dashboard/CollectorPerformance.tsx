import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface Collector {
  id: string;
  name: string;
  assignedZone: string;
  collectionsToday: number;
  totalCollections: number;
  avatar?: string;
  status: 'active' | 'inactive' | 'on_break';
  lastCollection?: string;
}

interface CollectorPerformanceProps {
  collectors?: Collector[];
}

const mockCollectors: Collector[] = [
  {
    id: '1',
    name: 'John Smith',
    assignedZone: 'Downtown East',
    collectionsToday: 45,
    totalCollections: 1247,
    status: 'active',
    lastCollection: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    assignedZone: 'Westside District',
    collectionsToday: 52,
    totalCollections: 1389,
    status: 'active',
    lastCollection: '1 hour ago'
  },
  {
    id: '3',
    name: 'Mike Chen',
    assignedZone: 'North Campus',
    collectionsToday: 38,
    totalCollections: 987,
    status: 'on_break',
    lastCollection: '3 hours ago'
  },
  {
    id: '4',
    name: 'Emily Davis',
    assignedZone: 'South Industrial',
    collectionsToday: 61,
    totalCollections: 1567,
    status: 'active',
    lastCollection: '30 minutes ago'
  },
  {
    id: '5',
    name: 'David Wilson',
    assignedZone: 'Central Business',
    collectionsToday: 43,
    totalCollections: 1123,
    status: 'active',
    lastCollection: '1.5 hours ago'
  },
  {
    id: '6',
    name: 'Lisa Rodriguez',
    assignedZone: 'University Area',
    collectionsToday: 49,
    totalCollections: 1345,
    status: 'inactive',
    lastCollection: '5 hours ago'
  }
];

const CollectorPerformance: React.FC<CollectorPerformanceProps> = ({ 
  collectors = mockCollectors 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCollectors, setFilteredCollectors] = useState<Collector[]>(collectors);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'collectionsToday' | 'totalCollections'>('collectionsToday');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    let filtered = collectors.filter(collector =>
      collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.assignedZone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered results
    filtered.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b[sortBy] - a[sortBy];
      }
      return a[sortBy] - b[sortBy];
    });

    setFilteredCollectors(filtered);
    setPage(0); // Reset to first page when filtering
  }, [collectors, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: 'collectionsToday' | 'totalCollections') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_break':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'on_break':
        return 'On Break';
      default:
        return status;
    }
  };

  const totalCollectionsToday = filteredCollectors.reduce((sum, collector) => sum + collector.collectionsToday, 0);
  const totalCollectionsAllTime = filteredCollectors.reduce((sum, collector) => sum + collector.totalCollections, 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Collector Performance Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor collection efficiency and performance metrics
          </Typography>
        </Box>
        
        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white', 
            borderRadius: 2,
            minWidth: 120,
            textAlign: 'center'
          }}>
            <Typography variant="h6">{totalCollectionsToday}</Typography>
            <Typography variant="body2">Collections Today</Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'secondary.main', 
            color: 'white', 
            borderRadius: 2,
            minWidth: 120,
            textAlign: 'center'
          }}>
            <Typography variant="h6">{totalCollectionsAllTime.toLocaleString()}</Typography>
            <Typography variant="body2">Total Collections</Typography>
          </Box>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search collectors or zones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <IconButton 
          onClick={() => handleSort('collectionsToday')}
          color={sortBy === 'collectionsToday' ? 'primary' : 'default'}
        >
          <TrendingUpIcon />
        </IconButton>
        
        <Typography variant="body2" color="text.secondary">
          {filteredCollectors.length} collectors found
        </Typography>
      </Box>

      {/* Performance Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Collector</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Assigned Zone</TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSort('collectionsToday')}
                >
                  Collections Today
                  {sortBy === 'collectionsToday' && (
                    <TrendingUpIcon sx={{ ml: 1, fontSize: 16 }} />
                  )}
                </TableCell>
                <TableCell 
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSort('totalCollections')}
                >
                  Total Collections
                  {sortBy === 'totalCollections' && (
                    <TrendingUpIcon sx={{ ml: 1, fontSize: 16 }} />
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Collection</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCollectors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((collector) => (
                <TableRow key={collector.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={collector.avatar} sx={{ width: 40, height: 40 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {collector.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {collector.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {collector.assignedZone}
                      </Typography>
                    </Box>
                    </TableCell>
                  
                  <TableCell>
                    <Typography variant="h6" color="primary.main">
                      {collector.collectionsToday}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body1">
                      {collector.totalCollections.toLocaleString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusLabel(collector.status)}
                      color={getStatusColor(collector.status) as any}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {collector.lastCollection}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCollectors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};

export default CollectorPerformance;

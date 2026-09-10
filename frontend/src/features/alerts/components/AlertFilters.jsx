const AlertFilters = ({
    severity,
    search,
    sortBy,
    onSeverityChange,
    onSearchChange,
    onSortChange,
    onClear,
}) => {

    return (
        <div className="alert-filters">

            {/* SEVERITY */}

            <div className="filter-group">

                <label htmlFor="severity-filter">
                    Severity
                </label>

                <div className="select-wrapper">

                    <select
                        id="severity-filter"
                        value={severity}
                        onChange={(e) =>
                            onSeverityChange(e.target.value)
                        }
                    >
                        <option value="all">
                            All severities
                        </option>

                        <option value="critical">
                            Critical
                        </option>

                        <option value="high">
                            High
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="low">
                            Low
                        </option>
                    </select>

                </div>

            </div>


            {/* SEARCH */}

            <div className="filter-group filter-search">

                <label htmlFor="alert-search">
                    Search
                </label>

                <div className="search-wrapper">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        id="alert-search"
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search device, room or alert..."
                    />

                </div>

            </div>


            {/* SORT */}

            <div className="filter-group">

                <label htmlFor="alert-sort">
                    Sort by
                </label>

                <div className="select-wrapper">

                    <select
                        id="alert-sort"
                        value={sortBy}
                        onChange={(e) =>
                            onSortChange(e.target.value)
                        }
                    >
                        <option value="newest">
                            Newest first
                        </option>

                        <option value="oldest">
                            Oldest first
                        </option>

                        <option value="severity">
                            Severity
                        </option>
                    </select>

                </div>

            </div>


            {/* CLEAR */}

            <button
                type="button"
                className="clear-filters-btn"
                onClick={onClear}
            >
                Clear filters
            </button>

        </div>
    );
};

export default AlertFilters;
import React from 'react'
import PropTypes from 'prop-types'

import Style from '../components/style'
import Search from '../components/search'
import Results from '../components/results'
import globalEmitter from '../lib/globalEmitter'

class Zazu extends React.Component {
  constructor(properties) {
    super(properties)

    this.state = {
      activeIndex: 0,
      previousQuery: null,
    }
  }

  componentDidMount() {
    globalEmitter.on('hideWindow', this.handleResetQuery)
    globalEmitter.on('showWindow', this.sendEmptyQuery)
  }

  componentWillUnmount() {
    globalEmitter.removeListener('hideWindow', this.handleResetQuery)
    globalEmitter.removeListener('showWindow', this.sendEmptyQuery)
  }

  sendEmptyQuery = (activePlugin, activeBlock) => {
    this.props.scopeBlock(activePlugin, activeBlock)
    this.props.handleQueryChange('')
    this.setState({
      activeIndex: 0,
    })
  }

  handleResetQuery = () => {
    this.props.handleResetQuery()
  }

  handleUpdateActiveIndex = (index) => {
    this.setState({
      activeIndex: index,
    })
  }

  handleResultClick = (result) => {
    globalEmitter.emit('hideWindow')
    this.props.handleResultClick(result)
  }

  handleQueryChange = (query) => {
    const queryNotChanged = query !== this.state.previousQuery
    const activeIndex = queryNotChanged ? 0 : this.state.activeIndex
    if (query !== this.state.previousQuery) {
      this.props.handleQueryChange(query)
      this.setState({ previousQuery: query })
    }
    this.setState({ activeIndex })
  }

  render() {
    const { query, results, theme } = this.props
    return (
      <div style={{ maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
        <Style css={theme} />
        <Search handleQueryChange={this.handleQueryChange} value={query} />
        <Results
          values={results}
          activeIndex={this.state.activeIndex}
          handleResultClick={this.handleResultClick}
          handleUpdateActiveIndex={this.handleUpdateActiveIndex}
        />
      </div>
    )
  }
}

Zazu.propTypes = {
  query: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  handleResetQuery: PropTypes.func.isRequired,
  handleResultClick: PropTypes.func.isRequired,
  handleQueryChange: PropTypes.func.isRequired,
  scopeBlock: PropTypes.func.isRequired,
}

export default Zazu

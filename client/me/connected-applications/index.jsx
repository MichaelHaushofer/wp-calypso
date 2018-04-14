/** @format */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { get, times } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import ConnectedAppItem from 'me/connected-application-item';
import DocumentHead from 'components/data/document-head';
import EmptyContent from 'components/empty-content';
import Main from 'components/main';
import MeSidebarNavigation from 'me/sidebar-navigation';
import QueryConnectedApplications from 'components/data/query-connected-applications';
import ReauthRequired from 'me/reauth-required';
import SecuritySectionNav from 'me/security-section-nav';
import twoStepAuthorization from 'lib/two-step-authorization';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import { getConnectedApplications, getRequest } from 'state/selectors';
import { requestConnectedApplications } from 'state/connected-applications/actions';

class ConnectedApplications extends PureComponent {
	static propTypes = {
		translate: PropTypes.func.isRequired,
	};

	renderEmptyContent() {
		const { translate } = this.props;

		return (
			<EmptyContent
				title={ translate( "You haven't connected any apps yet." ) }
				line={ translate( 'You can get started with the {{link}}WordPress mobile apps!{{/link}}', {
					components: {
						link: (
							<a
								href="https://apps.wordpress.org/"
								target="_blank"
								rel="noopener noreferrer"
								title="WordPress Mobile Apps"
							/>
						),
					},
				} ) }
			/>
		);
	}

	renderPlaceholders() {
		const { translate } = this.props;

		return times( 5, index => (
			<ConnectedAppItem
				connection={ {
					ID: index,
					title: translate( 'Loading Connected Applications' ),
				} }
				key={ index }
				isPlaceholder
			/>
		) );
	}

	renderConnectedApps() {
		const { apps } = this.props;

		if ( ! apps.length ) {
			return this.renderPlaceholders();
		}

		return apps.map( connection => (
			<ConnectedAppItem connection={ connection } key={ connection.ID } />
		) );
	}

	renderConnectedAppsList() {
		const { apps, isRequestingApps, path } = this.props;

		return (
			<Fragment>
				<SecuritySectionNav path={ path } />

				{ ! isRequestingApps && ! apps.length
					? this.renderEmptyContent()
					: this.renderConnectedApps() }
			</Fragment>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<Main className="connected-applications">
				<QueryConnectedApplications />

				<PageViewTracker
					path="/me/security/connected-applications"
					title="Me > Connected Applications"
				/>
				<ReauthRequired twoStepAuthorization={ twoStepAuthorization } />
				<MeSidebarNavigation />

				<DocumentHead title={ translate( 'Connected Applications' ) } />

				{ this.renderConnectedAppsList() }
			</Main>
		);
	}
}

export default connect( state => ( {
	apps: getConnectedApplications( state ),
	isRequestingApps: get( getRequest( state, requestConnectedApplications() ), 'isLoading', false ),
} ) )( localize( ConnectedApplications ) );

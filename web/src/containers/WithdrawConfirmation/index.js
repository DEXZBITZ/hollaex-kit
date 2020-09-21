import React, { Component } from 'react';
import classnames from 'classnames';

import { IconTitle, Button, Loader } from '../../components';
import { performConfirmWithdrawal } from '../../actions/walletActions';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class ConfirmWithdrawal extends Component {
    state = {
        is_success: false,
        error_txt: '',
        loading: false
    };

    componentDidMount() {
        if (this.props.routeParams.token) {
            this.confirmWithdrawal(this.props.routeParams.token);
        } else {
            // TODO: this text is dummy will change to en.js after approval.
            this.setState({ error_txt: 'Invalid token Please try again.' });
        }
    }

    confirmWithdrawal = token => {
        this.setState({ loading: true });
        return performConfirmWithdrawal(token)
            .then((response) => {
                this.setState({ is_success: true, error_txt: '', loading: false });
                return response;
            })
            .catch((err) => {
                this.setState({ is_success: false, error_txt: err.response.data.message || err.message, loading: false });
            })
    };

    handleTransaction = () => {
        this.props.router.push('/transactions?tab=2');
    };

    render() {
        const { is_success, error_txt, loading } = this.state;
        let childProps = {};
        if (loading) {
            childProps = {
                loading,
                child: <Loader relative={true} background={false} />
            }
        } else if (!is_success && error_txt) {
            childProps = {
                titleSection: {
                    iconPath: ICONS.RED_WARNING,
                    text: STRINGS.ERROR_TEXT
                },
                child: <div className='text-center mb-4'>
                        <div>{error_txt}</div>
                    </div>
            }
        } else {
            childProps = {
                titleSection: {
                    iconPath: ICONS.GREEN_CHECK,
                    text: STRINGS.SUCCESS_TEXT
                },
                useSvg: true,
                child: <div className='text-center mb-4'>
                    <div>{STRINGS["WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_1"]}</div>
                    <div>{STRINGS["WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2"]}</div>
                </div>
            }
        }
        return (
            <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1', 'withdrawal-confirm-warpper')}>
                <div
                    className={classnames(
                        ...FLEX_CENTER_CLASSES,
                        'flex-column',
                        'w-100',
                        { "auth_wrapper": !loading}
                    )}
                >
                    <IconTitle
                        textType="title"
                        className="w-100"
                        {...childProps.titleSection}
                    />
                    {childProps.child}
                    {!loading &&
                        <Button
                            className='w-50'
                            label={STRINGS["WITHDRAW_PAGE.GO_WITHDRAWAL_HISTORY"]}
                            onClick={this.handleTransaction}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default ConfirmWithdrawal;
